import { Waveform, Filter, PitchName } from './types';

/**
 * 状態管理変数
 */
const currentNote = 0;
const nextNoteTime = 0;
const currentWaveform = 'sawtooth';
const currentFilter = 'lowpass';
const filterFrequency = 15000; // 15000 ~ 20
const filterQ = 10 // 0 ~ 30;
const noteLength = 8;
const noteGain = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
const phrase: PitchName[] = [
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
  'a2',
];
const synthPattern = [
  false,
  false,
  true,
  true,
  false,
  false,
  true,
  true,
  false,
  false,
  true,
  true,
  false,
  false,
  true,
  true,
];
const kickPattern = [
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
];
const snarePattern = [
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
];
const hihatPattern = [
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
];
const masterVolume = 40;
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
  noteLength,
  noteGain,
  phrase,
  synthPattern,
  kickPattern,
  snarePattern,
  hihatPattern,
  masterVolume,
  bpm,
  initialized,
  playing,
};

export default store;
