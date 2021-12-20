import { PitchName } from './types';

/**
 * 音名を周波数に変換して返す
 * @param pitchName 音名 (c2 - b4)
 * @returns 周波数
 */
const pitchNameToFrequency = (pitchName: PitchName): number => {
  const table = {
    c2: 65.406,
    'c#2': 69.296,
    d2: 73.416,
    'd#2': 77.782,
    e2: 82.407,
    f2: 87.307,
    'f#2': 92.499,
    g2: 97.999,
    'g#2': 103.826,
    a2: 110,
    'a#2': 116.541,
    b2: 123.471,
    c3: 130.813,
    'c#3': 138.591,
    d3: 146.832,
    'd#3': 155.563,
    e3: 164.814,
    f3: 174.614,
    'f#3': 184.997,
    g3: 195.998,
    'g#3': 207.652,
    a3: 220,
    'a#3': 233.082,
    b3: 246.942,
    c4: 261.626,
    'c#4': 277.183,
    d4: 293.665,
    'd#4': 311.127,
    e4: 329.628,
    f4: 349.228,
    'f#4': 369.994,
    g4: 391.995,
    'g#4': 415.305,
    a4: 440,
    'a#4': 466.164,
    b4: 493.883,
    c5: 523.251,
    'c#5': 554.365,
    d5: 587.33,
    'd#5': 622.254,
    e5: 659.255,
    f5: 698.456,
    'f#5': 739.989,
    g5: 783.991,
    'g#5': 830.609,
    a5: 880,
    'a#5': 932.328,
    b5: 987.767,
  };

  return table[pitchName];
};

const defaultPhrase: PitchName[] = [
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
  'c2',
];

const defaultNoteVolume = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];

const defaultPattern = [
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
];

export {
  pitchNameToFrequency,
  defaultPhrase,
  defaultNoteVolume,
  defaultPattern,
};
