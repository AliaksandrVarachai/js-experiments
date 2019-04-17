/*
let i = 0;
function foo() {
  i++;
  if (i > 5)
    return;
  console.log('foo');
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  process.nextTick(foo);
}
setTimeout(foo, 2);
setTimeout(() => {
  console.log('other setTimeout');
}, 2);
setImmediate(() => {
  console.log('setImmediate');
});
*/

const fs = require('fs');
fs.readFile('timers.js', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});

let bar ;
function someAsyncCall(callback) {
  //callback();
  process.nextTick(callback);
}
someAsyncCall(() => {
  console.log('bar', bar);
});
bar = 1;

const net = require('net');
const server = net.createServer(() => {}).listen(8080);
process.nextTick(() => {
  server.listen(8080, () => console.log('listening port 8080...'))
});
server.on('listening', () => {
  console.log('listening EVENT')
});

