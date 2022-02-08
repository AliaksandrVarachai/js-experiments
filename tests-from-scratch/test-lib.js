const describe = function(msg, callback) {
  console.log(`* ${msg}`);
  callback();
};

const it = function(msg, callback) {
  console.log(`- ${msg}`);
  callback();
}

const expect = function(actual) {
  return {
    toBe: function(expected) {
      const res = expected === actual;
      console.log(`expected = ${expected}; actual = ${actual}`);
      if (res) console.log('passed');
      else console.log('failed');
      return res;
    }
  }
}

module.exports = { describe, it, expect };
