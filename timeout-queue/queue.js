//accelerated queue of messages
const scriptStart = Date.now();
const queue = [];
let start; //ms
let timeoutId;

function getShowTimeout(queueLength) {
  if (queueLength < 1)
    throw Error('Queue length must be an integer greater than 0.');
  switch(queueLength) {
    case 1: return 5000;
    case 2: return 2000;
    default: return 1000;
  }
}

function getRealTimeout() {
  const now = Date.now()
  return `${now - start}:${now - scriptStart}`;
}

function stopShowMessage(updateStart) {
  console.log(`End [${queue[0]}] - ${getRealTimeout()}`, queue);
  queue.shift();
  if (updateStart) {
    start = Date.now();
  }
  if (queue.length > 0) {
    timeoutId = setTimeout(() => stopShowMessage(true), getShowTimeout(queue.length));
  }
}

function addMessage(msg) {
  queue.push(msg);

  if (queue.length === 1) {
    start = Date.now();
    timeoutId = setTimeout(() => stopShowMessage(true), getShowTimeout(1));
  } else {
    const timeLeft = start + getShowTimeout(queue.length) - Date.now();
    if (timeLeft > 0) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => stopShowMessage(false), timeLeft);
    } else {
      clearTimeout(timeoutId);
      stopShowMessage(true);
    }
  }
}




//test
setTimeout(() => {
  addMessage('msg #1');
  addMessage('msg #2');
  addMessage('msg #3');
  addMessage('msg #4');
}, 1000);

setTimeout(() => {
  addMessage('msg #5');
}, 3000);

setTimeout(() => {
  addMessage('msg #6');
}, 3000);



