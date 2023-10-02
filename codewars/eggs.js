// JS bigInts has already been preloaded in constant BigNumber
// Usage: https://github.com/MikeMcl/bignumber.js/

module.exports.default = function height(n,m) {
  const memoizedHeight = [];
  for (let i = 0; i < m; ++i) memoizedHeight[i] = [0, 1];
  for (let j = 1; j < m; ++j) {
    memoizedHeight[0][j] = 0;
    memoizedHeight[1][j] = j;
  }


  function _height(n,m) {
    if (memoizedHeight[n][m]) return memoizedHeight[n][m];
    const h = _height(n, m-1) + _height(n-1, m-1) + 1;
    memoizedHeight[n][m] = h;
    return h;
  }

  if (n === 0 || m === 0) return 0;
  return _height(n,m);
  // if (n === 0 || m === 0) return new BigNumber(0);
  // return new BigNumber(_height(n,m));
}
