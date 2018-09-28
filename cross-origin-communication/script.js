const messageToSendNode = document.getElementById('message-to-send');
const receivedMessageNode = document.getElementById('received-message');
const sendNode = document.getElementById('send');

const channel = new MessageChannel();
let frameIsLoaded = false;

sendNode.onclick = function(event) {
  console.log('Container says: ' + messageToSendNode.value);
  if (!frameIsLoaded) {
    console.log('Wait a bit while frames are loading');
    return;
  }
  channel.port1.postMessage(messageToSendNode.value)
};

// Listen iframe
window.onmessage = function(event) {
  if (event.origin !== 'http://localhost:9080') {
    console.warn(`${event.origin} is not allowed`);
    return;
  }
  frameIsLoaded = true;
  window.frames[0].postMessage(messageToSendNode.value, event.origin, [channel.port2]);
  channel.port1.onmessage = function(event) {
    // It is not necessary to check an event.origin
    receivedMessageNode.innerText = event.data;
  };
};

function EventBus() {
  this.events = {};
}

EventBus.prototype.addEventListener = function(name, cb) {
  if (this.events[name]) {
    this.events[name].push(cb)
  } else {
    this.events[name] = [cb];
  }
  console.log(`Callback is added for "${name}" event`);
};

EventBus.prototype.removeEventListener = function(name, cb) {
  if (!this.events[name])
    throw Error(`There is no "${name}" event listener`);

  const removeEvent = name => {
    //const { [name]: _, ...res } = this.events;
    this.events = Object.keys(this.events).reduce((acc, key) => {
      if (key !== name)
        acc[key] = this.events[key];
      return acc;
    }, {})
  };

  const callbacks = this.events[name];
  if (cb) {
    const inx = callbacks.indexOf(cb);
    if (inx < 0)
      throw Error(`There is no passed callback in "${name}" event listener`);
    if (inx === 0 && callbacks.length === 1) {
      removeEvent(name);
    } else {
      callbacks.splice(inx, 1);
    }
  } else {
    removeEvent(name);
  }
  console.log(`Callback is removed from "${name}" event`);
};

EventBus.prototype.dispatch = function(name) {
  if (!this.events[name])
    throw Error(`Dispatched "${name}" events is not found`);
  this.events[name].forEach(cb => cb());
  console.log(`Dispatch for "${name}" is called`)
};

// tests
const eventBus = new EventBus(); // must be a singletone
const timerEventName = 'timer';
let counter = 0;

const start = Date.now();
const timerInterval = setInterval(() => {

  const callback = () => {
    console.log(`listener ${counter++} is called`);
  };

  setTimeout(() => {
    eventBus.removeEventListener(timerEventName, callback);
  }, 1500);

  eventBus.addEventListener(timerEventName, callback);

  if (Date.now() > start + 5000)
    clearInterval(timerInterval);
}, 1000);

setTimeout(() => {
  eventBus.dispatch(timerEventName);
}, 3000);