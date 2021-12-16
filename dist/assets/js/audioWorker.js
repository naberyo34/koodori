let timerId;
let interval = 100;

onmessage = (e) => {
  if (e.data === 'start') {
    timerId = setInterval(() => {
      postMessage('tick');
    }, interval);
  }
  if (e.data === 'stop') {
    clearInterval(timerId);
    timerId = null;
  }
  if (e.data.interval) {
    interval = e.data.interval;
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(() => {
        postMessage('tick');
      }, interval);
    }
  }
};
