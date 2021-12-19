type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';
type Filter = 'lowpass' | 'highpass';
type PitchName =
  | 'c2'
  | 'c#2'
  | 'd2'
  | 'd#2'
  | 'e2'
  | 'f2'
  | 'f#2'
  | 'g2'
  | 'g#2'
  | 'a2'
  | 'a#2'
  | 'b2'
  | 'c3'
  | 'c#3'
  | 'd3'
  | 'd#3'
  | 'e3'
  | 'f3'
  | 'f#3'
  | 'g3'
  | 'g#3'
  | 'a3'
  | 'a#3'
  | 'b3'
  | 'c4'
  | 'c#4'
  | 'd4'
  | 'd#4'
  | 'e4'
  | 'f4'
  | 'f#4'
  | 'g4'
  | 'g#4'
  | 'a4'
  | 'a#4'
  | 'b4';

/**
 * waveform: 波形
 * gain: 音量
 * pitchName: 音名
 * length: ノートの長さ
 */
type SynthOption = {
  waveform: Waveform;
  gain: number;
  pitchName: PitchName;
  length: number;
};

export { Waveform, Filter, PitchName, SynthOption };
