type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';
type Filter = 'lowpass' | 'highpass';
type PitchName =
  | 'c2'
  | 'd2'
  | 'e2'
  | 'f2'
  | 'g2'
  | 'a2'
  | 'b2'
  | 'c3'
  | 'd3'
  | 'e3'
  | 'f3'
  | 'g3'
  | 'a3'
  | 'b3'
  | 'c4'
  | 'd4'
  | 'e4'
  | 'f4'
  | 'g4'
  | 'a4'
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
