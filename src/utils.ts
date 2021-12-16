import { PitchName } from "./types";

/**
 * 音名を周波数に変換して返す
 * @param pitchName 音名 (c2 - b4)
 * @returns 周波数
 */
export const pitchNameToFrequency = (pitchName: PitchName): number => {
  const table = {
    c2: 65.406,
    d2: 73.416,
    e2: 82.407,
    f2: 87.307,
    g2: 97.999,
    a2: 110,
    b2: 123.471,
    c3: 130.813,
    d3: 146.832,
    e3: 164.814,
    f3: 174.614,
    g3: 195.998,
    a3: 220,
    b3: 246.942,
    c4: 261.626,
    d4: 293.665,
    e4: 329.628,
    f4: 349.228,
    g4: 391.995,
    a4: 440,
    b4: 493.883,
  };

  return table[pitchName];
};
