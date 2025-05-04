const f = (n,i=2,r=[]) => n>1 ? n%i ? f(n,i+1,r) : f(n/i,i,r.concat(i)) : r;
const c = (p,r=1,i=2) => i<p ? f(i)[1] ? c(p,r,i+1) : c(p,r+1,i+1) : r-1 ? f(r).map(h) : [];
const h = i => c(i);
const s = a => a.reduce((r,e) => r+s(e),'1')+' ';
const encode = i => +('0b'+s(f(i).map(h)).trim().replace(/ /g,'0').slice(1,-1));

const primes = [2, 3]; // 2 has 1st pos

function decode(n) {
  const bin = n.toString(2) + '1';
  let arr = binToArray([]);
  const isPrime = arr.length === 1;
  if (isPrime) arr = arr[0];
  return arrToNumber(arr, true);

  // Updates primes. If primePos < primes.length, it does nothing
  function getPrimeByPos(primePos) {
    updatePrimes(primePos);
    return primes[primePos - 1];

    function updatePrimes(primePos) {
      let i = primes[primes.length - 1] + 2;
      while (primes.length < primePos) {
        let isPrime = true;
        for (let p of primes) {
          if (i % p === 0) {
            isPrime = false;
            break;
          }
        }
        if (isPrime) primes.push(i);
        i += 2;
      }
    }
  }

  function arrToNumber(a, isRoot) {
    if (a.length === 0) return 2;
    if (a.length === 1) {
      return getPrimeByPos(arrToNumber(a[0]));
    }
    if (a.length > 1) {
      const mult = a.reduce((p, v) => {
        if (Array.isArray(v)) {
          return p * arrToNumber(v);
        }
        return p * v;
      }, 1);
      if (isRoot && !isPrime) return mult;
      return getPrimeByPos(mult);
    }
  }

  function binToArray(arr) {
    let i = 0;
    toArray(arr);
    return arr;

    function toArray(arr) {
      while (i < bin.length) {
        if (bin[i] === '1') {
          const innerArr = [];
          arr.push(innerArr)
          i++
          toArray(innerArr);
        } else {
          i++;
          return;
        }
      }
    }
  }
}

const tests = [
  // [1, 3],
  // [2, 4],
  // [3, 5],
  // [5, 6],
  // [6, 7],
  // [10, 8],
  // [25, 9],
  // [11, 10],
  // [179189987, 10000],
  // [944359, 10001],
  // [183722, 10002],
  // [216499, 10003],
  // [27030299, 10005],
  [2115705627, 9999991],
]

tests.forEach(([input, output]) => {
  const actualOutput = decode(input);
  if (actualOutput === output) {
    console.log(`test [${[input, output]}] passed`)
  } else {
    console.log(`test ${[input, output]} failed: expected ${actualOutput} to equal ${output}`)
  }
});
