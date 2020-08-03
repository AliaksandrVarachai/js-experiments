const dns = require('dns');
const nSecPerSec = BigInt(1e9);
const start = process.hrtime.bigint();

for (let i = 0; i < 10; ++i) {
  dns.lookup(`fake-servername.${Math.random()}.tld`, (err, address, family) => {
    const d = process.hrtime.bigint() - start;
    console.log(`lookup ${i} finished in ${d / nSecPerSec}.${(d % nSecPerSec).toString().substring(0, 3)} sec`);
  });
}