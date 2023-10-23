// JS bigInts has already been preloaded in constant BigNumber
// Usage: https://github.com/MikeMcl/bignumber.js/
let prevValue;

function coef(m, n) {
  if (m === 0) return 1;
  if (m === 1) {
    prevValue = n;
    return prevValue;
  }
  console.log(`******** prevValue=`, prevValue, m, n);
  prevValue = prevValue * (n - m) / (m + 1);
  return prevValue;

  // let result = 1;
  // for (let i = 0; i < m; ++i) {
  //     result *= (n - i) / (i + 1);
  // }
  // return result;
}

module.exports.default = function height(n,m) {
  if (n === 0 || m === 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; ++i) {
    sum += coef(i, m);
  }
  return sum;
  // if (n === 0 || m === 0) return new BigNumber(0);
  // return new BigNumber(_height(n,m));
}

module.exports.coef = coef;
