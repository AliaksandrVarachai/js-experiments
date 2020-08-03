setTimeout(() => console.log('setTimeout'), 5);
setImmediate(() => {
  console.log('setImmediate');
});

const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter {};

const myEventEmitter = new MyEventEmitter();

function cb() {console.log('cb')}
myEventEmitter.on('event', cb);
myEventEmitter.on('event', cb);
myEventEmitter.emit('event', 42);

