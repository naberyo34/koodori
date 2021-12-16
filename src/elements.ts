const initializeButton = document.querySelector(
  '[data-selector=initializeButton]',
);
const uiWrapper = document.querySelector('[data-selector=uiWrapper]');
const startButton = document.querySelector('[data-selector=startButton]');
const stopButton = document.querySelector('[data-selector=stopButton]');
const waveformSelects = document.querySelectorAll(
  '[data-selector=waveformSelect]',
);
const bpmInput = document.querySelector('[data-selector=bpmInput]');
const noteLengthInput = document.querySelector(
  '[data-selector=noteLengthInput]',
);
const filterTypeSelects = document.querySelectorAll(
  '[data-selector=filterTypeSelect]',
);
const filterFrequencyInput = document.querySelector(
  '[data-selector=filterFrequencyInput]',
);
const filterQInput = document.querySelector('[data-selector=filterQInput]');
const noteSelects = document.querySelectorAll('[data-selector=noteSelect]');
const noteGainInputs = document.querySelectorAll(
  '[data-selector=noteGainInput]',
);
const synthPatternSelects = document.querySelectorAll(
  '[data-selector=synthPatternSelect]',
);
const kickPatternSelects = document.querySelectorAll(
  '[data-selector=kickPatternSelect]',
);
const snarePatternSelects = document.querySelectorAll(
  '[data-selector=snarePatternSelect]',
);
const hihatPatternSelects = document.querySelectorAll(
  '[data-selector=hihatPatternSelect]',
);

export {
  initializeButton,
  uiWrapper,
  startButton,
  stopButton,
  waveformSelects,
  bpmInput,
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
};
