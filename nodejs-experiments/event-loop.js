const fs = require('fs');
const http = require('http');

const PORT = 3000;

http.createServer((req, res) => {
  console.log(`Server started on ${PORT}`, req, res)
})
  .on('message', )



const setTimeOutLogger = () => {
  console.log('setTimeout logger');
};

const setImmediateLogger = () => {
  console.log('setImmediate logger');
};

// timeouts
setTimeout(setTimeOutLogger, 1000);

// File I/O operation
for (let i = 1; i <= 5; i++) {
  fs.readFile('test.txt', 'utf-8', (err, data) => {
    if (err)
      console.error(err);
    console.log(`reading data ${i}: ${data.substring(0, 50)}`);
  });
}

// setImmediate
setImmediate(setImmediateLogger);
setImmediate(setImmediateLogger);
setImmediate(setImmediateLogger);

// synchronous
console.log('Simple output');

process.on('exit', () => {
  console.log('onExit callback');
});
