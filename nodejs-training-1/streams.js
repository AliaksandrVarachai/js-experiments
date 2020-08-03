const { Readable, Writable } = require('stream');

const readable = new Readable({
  read(size) {
    console.log(`read with size=${readable.readableLength} is called`);
  }
});
const writable = new Writable({
  autoDestroy: false,
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
const maxGenerationCounter = 3;

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
    return !!writable.end();
  }
  if (!writable.write(chunk)) {
    readable.off('readable', read)
    writable.once('drain', read)
  }
}

readable.on('readable', read);

readable.on('end', () => {
  console.log('readable.end');
});

writable.on('error', (error) => {
  console.log(error.message);
});




