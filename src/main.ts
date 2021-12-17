import { Waveform, PitchName, SynthOption, Filter } from './types';
import store from './store';
import {
  initializeButton,
  uiWrapper,
  startButton,
  stopButton,
  waveformSelects,
  bpmInput,
  masterVolumeInput,
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
let biquadFilterNode: BiquadFilterNode;
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
  if (store.synthPattern[store.currentNote]) {
    const { waveform, gain, pitchName, length } = synthOption;
    const oscNode = new OscillatorNode(audioCtx, { type: waveform });
    const noteGainNode = new GainNode(audioCtx, { gain });
    oscNode.frequency.value = pitchNameToFrequency(pitchName);
    oscNode.connect(noteGainNode);
    noteGainNode.connect(biquadFilterNode);
    oscNode.start(time);
    oscNode.stop(time + length);
  }

  // キック
  if (store.kickPattern[store.currentNote]) {
    const kickNode = audioCtx.createBufferSource();
    kickNode.buffer = kickBuffer;
    kickNode.connect(masterGainNode);
    kickNode.start(time);
  }

  // スネア
  if (store.snarePattern[store.currentNote]) {
    const snareNode = audioCtx.createBufferSource();
    snareNode.buffer = snareBuffer;
    snareNode.connect(masterGainNode);
    snareNode.start(time);
  }

  // ハイハット
  if (store.hihatPattern[store.currentNote]) {
    const hihatNode = audioCtx.createBufferSource();
    hihatNode.buffer = hihatBuffer;
    hihatNode.connect(masterGainNode);
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

/**
 * ループで定期実行される
 * (1) scheduleNoteで、直近のノート発音時間の準備
 * (2) getNextNoteTimeで、その次のノート発音時間を算出
 * (3) stepNextNoteで、カウント(0 ~ 15)を進める
 */
const scheduler = () => {
  const scheduleAheadTime = 0.1;
  while (store.nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    const secondsPerBeat = 60 / store.bpm;
    const noteTime = secondsPerBeat * 0.25;
    scheduleNote(store.nextNoteTime, {
      waveform: store.currentWaveform,
      gain: store.noteGain[store.currentNote] * 0.1,
      pitchName: store.phrase[store.currentNote],
      length: noteTime * store.noteLength * 0.1,
    });
    getNextNoteTime();
    stepNextNote();
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
 * 以下のようにconnectする
 * [フィルター (biquadFilterNode)]->[全体ボリューム (masterGainNode)]->[出力 (audioCtx.destination)]
 */
const initializeAudio = () => {
  audioCtx = new AudioContext();
  biquadFilterNode = new BiquadFilterNode(audioCtx, {
    type: store.currentFilter,
    frequency: store.filterFrequency,
    Q: store.filterQ,
  });
  masterGainNode = new GainNode(audioCtx, { gain: store.masterVolume * 0.01 });
  console.log({ masterGainNode });
  biquadFilterNode.connect(masterGainNode);
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
  if (value < 0 || value > 80) {
    alert('無効な値です。');
  }
  store.masterVolume = value;
  masterGainNode.gain.value = store.masterVolume * 0.01;
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
  biquadFilterNode.type = store.currentFilter;
};

const handleChangeFilterFrequency = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 20 || value > 20000) {
    alert('無効な値です。');
    return;
  }
  store.filterFrequency = value;
  biquadFilterNode.frequency.value = store.filterFrequency;
};

const handleChangeFilterQ = (e: Event) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 30) {
    alert('無効な値です。');
    return;
  }
  store.filterQ = value;
  biquadFilterNode.Q.value = store.filterQ;
};

const handleChangeNoteGain = (e: Event, index: number) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = Number(e.currentTarget.value);
  if (value < 0 || value > 10) {
    alert('無効な値です。');
    return;
  }
  store.noteGain[index] = value;
};

const handleChangePhrase = (e: Event, index: number) => {
  if (!(e.currentTarget instanceof HTMLSelectElement)) return;
  const value = e.currentTarget.value as PitchName;
  store.phrase[index] = value;
};

const handleChangePattern = (e: Event, index: number) => {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  const value = e.currentTarget.checked;
  const { type } = e.currentTarget.dataset;

  if (type === 'synth') {
    store.synthPattern[index] = value;
  }
  if (type === 'kick') {
    store.kickPattern[index] = value;
  }
  if (type === 'snare') {
    store.snarePattern[index] = value;
  }
  if (type === 'hihat') {
    store.hihatPattern[index] = value;
  }
};

// イベントに関数を割当
initializeButton?.addEventListener('click', handleInitialize);
startButton?.addEventListener('click', handleStart);
stopButton?.addEventListener('click', handleStop);
waveformSelects.forEach((waveformSelect) => {
  waveformSelect.addEventListener('change', handleChangeWaveform);
});
bpmInput?.addEventListener('input', handleChangeBpm);
masterVolumeInput?.addEventListener('input', handleChangeMasterVolume);
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
