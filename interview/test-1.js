async function sequence(data) {
  const result = await Promise.resolve(data);
  return result;
}


sequence(42)
  .then(data => console.log(data))
  .catch(error => console.log(error.message));

(async function f() {
  try {
    const result = await sequence(99);
    console.log(result);
  } catch(err) {
    console.log(err.message);
  }
})();

async function s2(arr) {
  const len = arr.length;

  async function _s(inx) {
    if (inx === len - 1)
      return await arr[inx]();
    else {
      const result = arr[inx]();
      return _s(inx + 1);
    }
  }

  

  return arr
}