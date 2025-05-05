const primes = [2, 3]; // 2 has 1st pos

function encode(n) {
  // const maxP = Math.floor(Math.sqrt(n));
  const maxP = n; // todo: required only if n is a prime number
  for (let i = 5; i <= maxP; i += 2) {
    let isPrime = true;
    for (let p of primes) {
      if (p > maxP) break;
      if (i % p === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }

  let factors = getFactors(n);
  debugger;
  const isPrime = factors.length === 0;
  if (isPrime) {
    factors = [getNumberByPrime(n)]
  }
  debugger;
  // const arr = factors.map(numberToArr);
  const arr = toEmptyArr(factors);
  console.log(arrToStr(arr).trim().replaceAll(' ', '0'));
  return +('0b' + arrToStr(arr).trim().replaceAll(' ', '0').slice(isPrime ? 0 : 1, -1));

  function getNumberByPrime(prime) {
    for (let i = 0; i < primes.length; ++i) {
      if (prime === primes[i]) return i + 1;
    }
  }

  function arrToStr(a) {
    return a.reduce((r, e) => r + arrToStr(e), '1') + ' ';
  }

  function toEmptyArr(a) {
    if (typeof a === 'number') {
      if (a === 2) return [];
      const fs = getFactors(a);

    }


    if (a.length > 1) {
      return a.map(toEmptyArr)
    }
    const el = a[0];
    if (el === 2) return [];
    const fs = getFactors(el);
    if (fs.length === 0) {
      return [toEmptyArr([getNumberByPrime(el)])]
    }
    return toEmptyArr(fs);
  }

  function numberToArr(num) {
    if (num === 2) return [];
    const fs = getFactors(num);
    debugger;
    if (fs.length === 0) return [numberToArr(getNumberByPrime(num))];
    return fs.map(numberToArr);
  }

  function getFactors(num) {
    const factors = [];
    let q = num;
    for (let p of primes) {
      if (p > q || p >= num) break;
      while (q % p === 0) {
        factors.push(p);
        q /= p;
      }
    }
    return factors;
  }
}


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
        const maxP = Math.floor(Math.sqrt(i));
        for (let p of primes) {
          if (p > maxP) break;
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

const encodeTests = [
  // [46, 185],
  // [3, 1],
  // [4, 2],
  // [5, 3],
  // [6, 5],
  [7, 6],
]

encodeTests.forEach(([input, output]) => {
  const actualOutput = encode(input);
  if (actualOutput === output) {
    console.log(`test [${[input, output]}] passed`)
  } else {
    console.log(`test ${[input, output]} failed: expected ${actualOutput} to equal ${output}`)
  }
});

const decodeTests = [
  [1, 3],
  [2, 4],
  [3, 5],
  [5, 6],
  [6, 7],
  [10, 8],
  [25, 9],
  [11, 10],
  [179189987, 10000],
  [944359, 10001],
  [183722, 10002],
  [216499, 10003],
  [27030299, 10005],
  [2115705627, 9999991],
]

// decodeTests.forEach(([input, output]) => {
//   const actualOutput = decode(input);
//   if (actualOutput === output) {
//     console.log(`test [${[input, output]}] passed`)
//   } else {
//     console.log(`test ${[input, output]} failed: expected ${actualOutput} to equal ${output}`)
//   }
// });
