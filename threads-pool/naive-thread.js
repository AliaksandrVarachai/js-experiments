const { createHmac } = require('node:crypto');
const secret = 'abcdefg';
const hmac = createHmac('sha512', secret);

function doHeavyStuff(data) {
  hmac.update(data); // if data is being streamed
  return hmac.digest();
}


const arr = new Array(200).fill('something');
function processChunk() {
  if (arr.length === 0) {
    console.log('processed successfully!!!');
  } else {
    console.log('processing chink');
    const subarr = arr.splice(0, 10);
    for (const item of subarr) {
      doHeavyStuff(item);
    }
  }
}