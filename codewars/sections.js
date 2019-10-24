// noprotect
var upperBound = 2e7;
var primes = new Int32Array(upperBound + 1).fill(1);
var primeCounter = 0;

(function fillPrimes() {
  primes[0] = 0;
  primes[1] = 0;
  for (var i = 2; i <= upperBound; ++i)
    if (primes[i]) {
      ++primeCounter;
      for (var j = 2, up = Math.floor(upperBound / i); j <= up; ++j)
        primes[i * j] = 0;
    }
})();

console.log('=============' + primeCounter);
var zippedPrimes = new Int32Array(primeCounter);

(function fillZippedPrimes() {
  var k = -1;
  for (var i = 0; i < primeCounter; ++i)
    if (primes[i])
      zippedPrimes[++k] = i;
})();

function c(k) {
  console.log('*****', k)

  if (k === 1)
    return 1;
  var factors = new Map();
  for (var p = 2, up = Math.floor(Math.sqrt(k)); p <= up; ++p) {
    if (!primes[p])
      continue;
    var pow = 0;
    var q = k;
    while (q % p === 0) {
      q = q / p;
      ++pow;
    }
    if (!pow)
      continue;
    if (pow % 2)
      return 0;

    k /= Math.pow(p, pow);
    if (primes[k])
      return 0;
    factors.set(p, 3 * pow);
  }
  for (let [key, value] of factors.entries()) {
    console.log(key + ':' + value);
  }
  console.log();
  var arr = Array.from(factors.values());
//   console.log(arr)


  var counter = 0;
  for (var i = 0, fSize = Math.pow(2, factors.size); i < fSize; ++i) {
    var bitmask = i.toString(2);
    bitmask  = '0'.repeat(factors.size - bitmask.length) + bitmask;
    var m = 1;
    for (var j = 0, bSize = bitmask.length; j < bSize; ++j) {
      if (bitmask[j] === '1') {
        m *= arr[j] / 2;
      }
    }
    counter += m;
  }

  return counter;
}