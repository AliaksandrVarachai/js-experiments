const buf = Buffer.from('абв', 'utf8');
console.log(buf);
const uint32array = new Uint32Array(buf);
console.log(uint32array);
const str = buf.toString('utf8');
console.log(str);