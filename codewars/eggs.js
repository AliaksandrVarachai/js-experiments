// JS bigInts has already been preloaded in constant BigNumber
// Usage: https://github.com/MikeMcl/bignumber.js/
module.exports.default = function height(n,m) {
  function _height(n,m) {
    if (n === 1) return m;
    if (m === 1) return 1;
    return _height(n, m-1) + _height(n-1, m-1) + 1;
  }

  if (n === 0 || m === 0) return 0;
  return _height(n,m);
  // if (n === 0 || m === 0) return new BigNumber(0);
  // return new BigNumber(_height(n,m));
}
