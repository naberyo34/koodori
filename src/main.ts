import { Waveform, PitchName, SynthOption, Filter } from './types';
import store from './store';
import {
  initializeButton,
  uiWrapper,
  bankSelects,
  startButton,
  stopButton,
  waveformSelects,
  bpmInput,
  masterVolumeInput,
  masterFilterTypeSelects,
  masterFilterFrequencyInput,
  masterFilterQInput,
  noteLengthInput,
  filterTypeSelects,
  filterFrequencyInput,
  filterQInput,
  noteSelects,
  noteGainInputs,
  synthPatternSelects,
  kickPatternSelects,
  snarePatternSelects,
  hihatPatternSelects,
  currentNoteIndicators,
} from './elements';
import { pitchNameToFrequency } from './utils';

// 初期化して使う
let audioCtx: AudioContext;
let masterGainNode: GainNode;
let synthFilterNode: BiquadFilterNode;
let masterFilterNode: BiquadFilterNode;
let kickBuffer: AudioBuffer;
let snareBuffer: AudioBuffer;
let hihatBuffer: AudioBuffer;
let worker: Worker;

/**
 * 指定された時間に鳴らす音を準備し、発音を予約する
 * @param time 発音時間
 * @param synthOption シンセサイザーで鳴らす音の詳細設定
 */
const scheduleNote = (time: number, synthOption: SynthOption) => {
  // シンセサイザー
  if (store.synthPattern[store.currentBank][store.currentNote]) {
    const { waveform, gain, pitchName, length } = synthOption;
    const oscNode = new OscillatorNode(audioCtx, { type: waveform });
    const noteGainNode = new GainNode(audioCtx, { gain });
    oscNode.frequency.value = pitchNameToFrequency(pitchName);
    oscNode.connect(noteGainNode);
    noteGainNode.connect(synthFilterNode);
    oscNode.start(time);
    oscNode.stop(time + length);
  }

  // キック
  if (store.kickPattern[store.currentBank][store.currentNote]) {
    const kickNode = audioCtx.createBufferSource();
    kickNode.buffer = kickBuffer;
    kickNode.connect(masterFilterNode);
    kickNode.start(time);
  }

  // スネア
  if (store.snarePattern[store.currentBank][store.currentNote]) {
    const snareNode = audioCtx.createBufferSource();
    snareNode.buffer = snareBuffer;
    snareNode.connect(masterFilterNode);
    snareNode.start(time);
  }

  // ハイハット
  if (store.hihatPattern[store.currentBank][store.currentNote]) {
    const hihatNode = audioCtx.createBufferSource();
    hihatNode.buffer = hihatBuffer;
    hihatNode.connect(masterFilterNode);
    hihatNode.start(time);
  }
};

/**
 * BPMから次の発音時間を算出
 */
const getNextNoteTime = () => {
  const secondsPerBeat = 60 / store.bpm;
  const noteTime = secondsPerBeat * 0.25;
  store.nextNoteTime += noteTime;
};

/**
 * カウント(0 ~ 15)を進める
 */
const stepNextNote = () => {
  currentNoteIndicators.forEach((currentNoteIndicator) => {
    currentNoteIndicator.classList.remove('--active');
  });
  currentNoteIndicators[store.currentNote].classList.add('--active');
  store.currentNote += 1;
  if (store.currentNote === 16) {
    store.currentNote = 0;
  }
};

/** バンクの変更が予約されているとき、16小節目になったらバンクを切り替える */
const changeReserveCurrentBank = () => {
  // reserveBankが0のときもfalseにならないよう、typeofで判定
  if (store.currentNote === 15 && typeof store.reserveBank === 'number') {
    store.currentBank = store.reserveBank;
    refreshDom();
    // バンクボタンの予約を解除
    store.reserveBank = false;
    bankSelects.forEach((bankSelect) => {
      bankSelect.classList.remove('--reserve');
    });
  }
};

/**
 * ループで定期実行される
 * (1) scheduleNoteで、直近のノート発音時間の準備
 * (2) getNextNoteTimeで、その次のノート発音時間を算出
 * (3) stepNextNoteで、カウント(0 ~ 15)を進める
 * (4) changeReserveCurrentBankで、16小節目にバンクを切り替える
 */
const scheduler = () => {
  const scheduleAheadTime = 0.1;
  while (store.nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    const secondsPerBeat = 60 / store.bpm;
    const noteTime = secondsPerBeat * 0.25;
    scheduleNote(store.nextNoteTime, {
      waveform: store.currentWaveform,
      gain: store.noteGain[store.currentBank][store.currentNote] * 0.1,
      pitchName: store.phrase[store.currentBank][store.currentNote],
      length: noteTime * store.noteLength * 0.1,
    });
    getNextNoteTime();
    stepNextNote();
    changeReserveCurrentBank();
  }
};

/**
 * オーディオファイルをAudioBufferに変換し、Audio APIで利用できるようにして返す
 * @param samplePath オーディオファイルのパス
 * @returns AudioBuffer
 */
const setupSample = async (samplePath: string) => {
  const response = await fetch(samplePath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
};

/**
 * 選択中のバンク状態をDOMに反映する
 */
const refreshDom = () => {
  noteSelects.forEach((noteSelect, index) => {
    noteSelect.value = store.phrase[store.currentBank][index];
  });
  noteGainInputs.forEach((noteGainInput, index) => {
    noteGainInput.value = store.noteGain[store.currentBank][index].toString();
  });
  synthPatternSelects.forEach((patternSelect, index) => {
    patternSelect.checked = store.synthPattern[store.currentBank][index];
  });
  kickPatternSelects.forEach((patternSelect, index) => {
    patternSelect.checked = store.kickPattern[store.currentBank][index];
  });
  snarePatternSelects.forEach((patternSelect, index) => {
    patternSelect.checked = store.snarePattern[store.currentBank][index];
  });
  hihatPatternSelects.forEach((patternSelect, index) => {
    patternSelect.checked = store.hihatPattern[store.currentBank][index];
  });
};

/**
 * ドラムの初期化
 */
const initializeDrums = async () => {
  const kick = await setupSample('assets/audio/kick.wav');
  const snare = await setupSample('assets/audio/snare.wav');
  const hihat = await setupSample('assets/audio/hihat.wav');
  kickBuffer = kick;
  snareBuffer = snare;
  hihatBuffer = hihat;
};

/**
 * オーディオ周りの初期化
 */
const initializeAudio = () => {
  audioCtx = new AudioContext();
  synthFilterNode = new BiquadFilterNode(audioCtx, {
    type: store.currentFilter,
    frequency: store.filterFrequency,
    Q: store.filterQ,
  });
  masterFilterNode = new BiquadFilterNode(audioCtx, {
    type: store.currentMasterFilter,
    frequency: store.masterFilterFrequency,
    Q: store.masterFilterQ,
  });
  masterGainNode = new GainNode(audioCtx, { gain: store.masterVolume * 0.01 });
  synthFilterNode.connect(masterFilterNode);
  masterFilterNode.connect(masterGainNode);
  masterGainNode.connect(audioCtx.destination);
};

/**
 * Workerの初期化
 */
const initializeWorker = () => {
  const lookahead = 25.0;
  worker = new Worker('assets/js/audioworker.js');
  worker.onmessage = (e) => {
    if (e.data === 'tick') {
      scheduler();
    }
  };
  worker.postMessage({ interval: lookahead });
};

// 以下、ユーザー操作時に発火する関数

/**
 * 初期化ボタン
 * note: Web Audio APIの利用時は、「はじめる」ボタン等を用いて
 * ユーザーが再生を許可してから初期化を行うのが望ましい。
 * see: https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
 */
const handleInitialize = async () => {
  const activeClass = '--active';
  initializeAudio();
  initializeDrums();
  initializeWorker();
  store.initialized = true;
  initializeButton?.classList.remove(activeClass);
  uiWrapper?.classList.add(activeClass);
  refreshDom();
};

const handleChangeBank = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;

  if (!store.playing || store.currentNote === 15) {
    const value = Number(e.currentTarget.value);
    store.currentBank = value;
    refreshDom();
  } else {
    const value = Number(e.currentTarget.value);
    store.reserveBank = value;
    // バンクボタンを予約中の表示に
    bankSelects[value].classList.add('--reserve');
  }
};

const handleStart = () => {
  if (store.playing) return;
  store.currentNote = 0;
  store.nextNoteTime = audioCtx.currentTime;
  worker.postMessage('start');
  store.playing = true;
};

const handleStop = () => {
  worker.postMessage('stop');
  store.playing = false;
  // 停止時にバンクボタンの予約がされている場合、移動して予約を解除
  if (typeof store.reserveBank === 'number') {
    store.currentBank = store.reserveBank;
    refreshDom();
    store.reserveBank = false;
    bankSelects.forEach((bankSelect) => {
      bankSelect.classList.remove('--reserve');
    });
  }
};

const handleChangeWaveform = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = e.currentTarget.value as Waveform;
  store.currentWaveform = value;
};

const handleChangeBpm = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 1 || value > 999) {
    alert('無効な値です。BPMは1 ~ 999の範囲で指定してください');
    return;
  }
  store.bpm = value;
};

const handleChangeMasterVolume = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 50) {
    alert('無効な値です。');
  }
  store.masterVolume = value;
  masterGainNode.gain.value = store.masterVolume * 0.01;
};

const handleChangeMasterFilterType = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = e.currentTarget.value as Filter;
  store.currentMasterFilter = value;
  masterFilterNode.type = store.currentMasterFilter;
};

const handleChangeMasterFilterFrequency = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 20 || value > 15000) {
    alert('無効な値です。');
    return;
  }
  store.masterFilterFrequency = value;
  masterFilterNode.frequency.value = store.masterFilterFrequency;
};

const handleChangeMasterFilterQ = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 30) {
    alert('無効な値です。');
    return;
  }
  store.masterFilterQ = value;
  masterFilterNode.Q.value = store.masterFilterQ;
};

const handleChangeNoteLength = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 10) {
    alert('無効な値です。');
  }
  store.noteLength = value;
};

const handleChangeFilterType = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = e.currentTarget.value as Filter;
  store.currentFilter = value;
  synthFilterNode.type = store.currentFilter;
};

const handleChangeFilterFrequency = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 20 || value > 15000) {
    alert('無効な値です。');
    return;
  }
  store.filterFrequency = value;
  synthFilterNode.frequency.value = store.filterFrequency;
};

const handleChangeFilterQ = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 30) {
    alert('無効な値です。');
    return;
  }
  store.filterQ = value;
  synthFilterNode.Q.value = store.filterQ;
};

const handleChangeNoteGain = (e: Event, index: number) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 10) {
    alert('無効な値です。');
    return;
  }
  store.noteGain[store.currentBank][index] = value;
};

const handleChangePhrase = (e: Event, index: number) => {
  if (!(e.currentTarget instanceof HTMLSelectElement)) return;
  const value = e.currentTarget.value as PitchName;
  store.phrase[store.currentBank][index] = value;
};

const handleChangePattern = (e: Event, index: number) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = e.currentTarget.checked;
  const { type } = e.currentTarget.dataset;
  if (type === 'synth') {
    store.synthPattern[store.currentBank][index] = value;
  }
  if (type === 'kick') {
    store.kickPattern[store.currentBank][index] = value;
  }
  if (type === 'snare') {
    store.snarePattern[store.currentBank][index] = value;
  }
  if (type === 'hihat') {
    store.hihatPattern[store.currentBank][index] = value;
  }
};

// イベントに関数を割当
initializeButton?.addEventListener('click', handleInitialize);
bankSelects.forEach((bankSelect) => {
  bankSelect.addEventListener('change', handleChangeBank);
});
startButton?.addEventListener('click', handleStart);
stopButton?.addEventListener('click', handleStop);
waveformSelects.forEach((waveformSelect) => {
  waveformSelect.addEventListener('change', handleChangeWaveform);
});
bpmInput?.addEventListener('input', handleChangeBpm);
masterVolumeInput?.addEventListener('input', handleChangeMasterVolume);
masterFilterTypeSelects.forEach((masterFilterTypeSelect) => {
  masterFilterTypeSelect.addEventListener(
    'change',
    handleChangeMasterFilterType,
  );
});
masterFilterFrequencyInput?.addEventListener(
  'input',
  handleChangeMasterFilterFrequency,
);
masterFilterQInput?.addEventListener('input', handleChangeMasterFilterQ);
noteLengthInput?.addEventListener('input', handleChangeNoteLength);
filterTypeSelects.forEach((filterTypeSelect) => {
  filterTypeSelect.addEventListener('change', handleChangeFilterType);
});
filterFrequencyInput?.addEventListener('input', handleChangeFilterFrequency);
filterQInput?.addEventListener('input', handleChangeFilterQ);
noteSelects.forEach((noteSelect, index) => {
  noteSelect.addEventListener('change', (e) => handleChangePhrase(e, index));
});
noteGainInputs.forEach((noteGainInput, index) => {
  noteGainInput.addEventListener('input', (e) =>
    handleChangeNoteGain(e, index),
  );
});
synthPatternSelects.forEach((synthPatternSelect, index) => {
  synthPatternSelect.addEventListener('change', (e) =>
    handleChangePattern(e, index),
  );
});
kickPatternSelects.forEach((kickPatternSelect, index) => {
  kickPatternSelect.addEventListener('change', (e) =>
    handleChangePattern(e, index),
  );
});
snarePatternSelects.forEach((snarePatternSelect, index) => {
  snarePatternSelect.addEventListener('change', (e) =>
    handleChangePattern(e, index),
  );
});
hihatPatternSelects.forEach((hihatPatternSelect, index) => {
  hihatPatternSelect.addEventListener('change', (e) =>
    handleChangePattern(e, index),
  );
});
