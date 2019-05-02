const fs = require('fs');
const path = require('path');

const filePath8 = path.resolve(__dirname, 'mocked-data/rus8.txt');
const filePath16 = path.resolve(__dirname, 'mocked-data/rus16.txt');

const readable8 = fs.createReadStream(filePath8, {encoding: 'utf8'});
const readable16 = fs.createReadStream(filePath16, {encoding: 'utf-16le'});
const writable8 = fs.createWriteStream(path.resolve(path.dirname(filePath8), 'rus8-output.txt'), {encoding: 'utf8'});
const writable16 = fs.createWriteStream(path.resolve(path.dirname(filePath16), 'rus16-output.txt'), {encoding: 'utf16le'});


fs.stat(filePath8, (err, stats) => {
  if (err)
    throw err;
  let fileSize = stats.size;
  let counter = 1;

  readable8.on('data', chunk => {

    var bufferedArr = new Uint16Array(chunk);
    console.log(typeof bufferedArr);
    console.log(chunk);
    console.log(String.fromCharCode(bufferedArr[0]));

    writable8.write(chunk);
    let percentageCopied = chunk.length * counter / this.fileSize * 100;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${Math.round(percentageCopied) / fileSize}%`);
    counter++;
  });

  readable8.on('end', err => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Reading is finished successfully\n');
    writable8.end();
  });

  readable8.on('error', err => {
    console.log('Error occured: ', e);
  });
});

writable8.on('close', err => {
  if (err)
    throw err;
  console.log('Writing is finished successfully\n');
});

readable16.on('data', chunk => {
  writable16.write(chunk);
  var bufferedArr = new Uint16Array(chunk);
  //console.log(bufferedArr);
  console.log('****', chunk, bufferedArr);
  console.log(String.fromCharCode(bufferedArr[0]));
});

writable16.on('finish', err => {
  if (err)
    throw err;
  console.log('Writing is finished successfully');
});



// let name = 'Node JS DEV';
//
// let buffer = Buffer.from(name);
// let buffer2 = Buffer.alloc(10)
// console.log(buffer);
// console.log(buffer2);