const initializeButton = document.querySelector<HTMLButtonElement>(
  '[data-selector=initializeButton]',
);
const uiWrapper = document.querySelector<HTMLDivElement>(
  '[data-selector=uiWrapper]',
);
const bankSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=bankSelect]',
);
const bankClearButton = document.querySelector<HTMLButtonElement>(
  '[data-selector=bankClearButton]',
);
const startButton = document.querySelector<HTMLButtonElement>(
  '[data-selector=startButton]',
);
const stopButton = document.querySelector<HTMLButtonElement>(
  '[data-selector=stopButton]',
);
const waveformSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=waveformSelect]',
);
const bpmInput = document.querySelector<HTMLInputElement>(
  '[data-selector=bpmInput]',
);
const masterVolumeInput = document.querySelector<HTMLInputElement>(
  '[data-selector=masterVolumeInput]',
);
const masterFilterTypeSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=masterFilterTypeSelect]',
);
const masterFilterFrequencyInput = document.querySelector<HTMLInputElement>(
  '[data-selector=masterFilterFrequencyInput]',
);
const masterFilterQInput = document.querySelector<HTMLInputElement>(
  '[data-selector=masterFilterQInput]',
);
const delayInput = document.querySelector<HTMLInputElement>(
  '[data-selector=delayInput]',
);
const reverbInput = document.querySelector<HTMLInputElement>(
  '[data-selector=reverbInput]',
);
const noteLengthInput = document.querySelector<HTMLInputElement>(
  '[data-selector=noteLengthInput]',
);
const filterTypeSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=filterTypeSelect]',
);
const filterFrequencyInput = document.querySelector<HTMLInputElement>(
  '[data-selector=filterFrequencyInput]',
);
const filterQInput = document.querySelector<HTMLInputElement>(
  '[data-selector=filterQInput]',
);
const noteSelects = document.querySelectorAll<HTMLSelectElement>(
  '[data-selector=noteSelect]',
);
const noteGainInputs = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=noteGainInput]',
);
const synthPatternSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=synthPatternSelect]',
);
const kickPatternSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=kickPatternSelect]',
);
const snarePatternSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=snarePatternSelect]',
);
const hihatPatternSelects = document.querySelectorAll<HTMLInputElement>(
  '[data-selector=hihatPatternSelect]',
);
const currentNoteIndicators = document.querySelectorAll<HTMLDivElement>(
  '[data-selector=currentNote]',
);

export {
  initializeButton,
  uiWrapper,
  bankSelects,
  bankClearButton,
  startButton,
  stopButton,
  waveformSelects,
  bpmInput,
  masterVolumeInput,
  masterFilterTypeSelects,
  masterFilterFrequencyInput,
  masterFilterQInput,
  delayInput,
  reverbInput,
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
};
