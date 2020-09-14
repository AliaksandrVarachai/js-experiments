const { Readable, Writable } = require('stream');

const readable = new Readable({
  read(size) {
    console.log(`read ${size} bytes`);
  }
});
const writable = new Writable({
  // autoDestroy: false,
  highWaterMark: 5,
  write(chunk, encoding, next) {
    const decodedData = chunk instanceof Buffer ? chunk.readInt32LE() : chunk;
    console.log(`write decodedData=${decodedData}`);
    next();
  },
  destroy(err) {
    console.log('writable destroy')
  }
});


let counter = 1;
const generatingInterval = 1000;
const maxGenerationCounter = 5;

(function generate() {
  setTimeout(() => {
    if (counter > maxGenerationCounter) {
      return readable.push(null);
    }
    const buf = Buffer.allocUnsafe(4);
    buf.writeInt32LE(counter++, 0);
    readable.push(buf);
    generate();
  }, generatingInterval);
})();

// Reads from readable stream
function read() {
  const chunk = readable.read();
  if (chunk === null) {
    writable.end();
    return;
  }
  if (!writable.write(chunk)) {
    readable.off('readable', read);
    writable.once('drain', () => {
      console.log('DRAIN');
      readable.on('readable', read);
    })
  }
}

readable.on('readable', read);

readable.on('end', () => {
  console.log('readable.end');
});

writable.on('error', (error) => {
  console.log(error.message);
});

// writable.cork();




