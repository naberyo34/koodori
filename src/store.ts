import { Waveform, Filter, PitchName, ReserveBank } from './types';

/**
 * 状態管理変数
 */
const currentNote = 0;
const nextNoteTime = 0;
const currentWaveform = 'sawtooth';
const currentFilter = 'lowpass';
const filterFrequency = 15000; // 15000 ~ 20
const filterQ = 10; // 0 ~ 30;
const currentMasterFilter = 'lowpass';
const masterFilterFrequency = 15000;
const masterFilterQ = 0;
const noteLength = 8;
const noteGain = [
  [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
];
const phrase: PitchName[][] = [
  [
    'f#3',
    'g#2',
    'e3',
    'g#2',
    'e3',
    'g#2',
    'g#2',
    'g#2',
    'e3',
    'g#2',
    'e3',
    'g#2',
    'e3',
    'g#2',
    'e3',
    'g#2',
  ],
  [
    'd#3',
    'f#2',
    'd#3',
    'f#2',
    'e3',
    'f#2',
    'e3',
    'f#2',
    'e2',
    'e2',
    'c#4',
    'e2',
    'b3',
    'e2',
    'g#3',
    'e2',
  ],
  [
    'c#3',
    'f#2',
    'c#3',
    'f#2',
    'b2',
    'f#2',
    'b2',
    'f#2',
    'e2',
    'e2',
    'c#4',
    'e2',
    'b3',
    'e2',
    'g#3',
    'e2',
  ],
  [
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
    'g#2',
  ],
];
const synthPattern = [
  [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ],
  [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ],
  [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ],
  [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
];
const kickPattern = [
  [
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
];
const snarePattern = [
  [
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ],
  [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
];
const hihatPattern = [
  [
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
  ],
  [
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
  ],
  [
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    true,
    false,
  ],
  [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
];
const currentBank = 0;
const reserveBank = false;
const masterVolume = 25;
const bpm = 128;
const initialized = false;
const playing = false;
const store = {
  currentNote,
  nextNoteTime,
  currentWaveform: currentWaveform as Waveform,
  currentFilter: currentFilter as Filter,
  filterFrequency,
  filterQ,
  currentMasterFilter: currentMasterFilter as Filter,
  masterFilterFrequency,
  masterFilterQ,
  noteLength,
  noteGain,
  phrase,
  synthPattern,
  kickPattern,
  snarePattern,
  hihatPattern,
  currentBank,
  reserveBank: reserveBank as ReserveBank,
  masterVolume,
  bpm,
  initialized,
  playing,
};

export default store;
