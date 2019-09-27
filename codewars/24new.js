var operations = ['+', '-', '*', '/'];

function operation(a, op, b) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
    default: throw('Unknown operator');
  }
}

/**
 * Callback with a found permutation.
 *
 * @callback permutationCallback
 * @param {number[]} perm - found permutation.
 * @returns {boolean} - true to continue or false to stop searching through.
 */

/**
 * Searches through all permutation of an array and calls the callback with every permutation.
 *
 * @param {number[]} a - the origin array.
 * @param {permutationCallback} cb - callback which can stop searching through.
 */
function permutationsWithEquals(a, cb) {
  var n = a.length;
  var s = a.slice();
  s.sort((x, y) => x - y);

  function next() {
    var i = n - 2;
    while (i >= 0 && s[i] >= s[i + 1])
      --i;
    if (i < 0)
      return false;
    var j = i + 1;
    while (j < n - 1 && s[j + 1] > s[i])
      ++j;
    [s[j], s[i]] = [s[i], s[j]];
    for(i = i + 1, j = n - 1; i < j; ++i, --j)
      [s[j], s[i]] = [s[i], s[j]];
    return true;
  }

  do {
    if (!cb(s)) return;
  } while (next());
}


function equalTo24(...args) {
  var result24 = "It's not possible!";
  var is24Found = false;

  /**
   * Reduces number of arguments recursively and writes all changes in corresponding history array.
   *
   * @param {number[]} vals - permutation of numbers.
   * @param {string[]} history - history of getting every vals element.
   */
  function f(vals, history) {
    if (is24Found)
      return;
    for (var i = 0; i < vals.length; ++i) {
      for (var j = 0; j < vals.length; ++j) {
        if (i === j)
          continue;
        for (var k = 0; k < operations.length; ++k) {
          var result = operation(vals[i], operations[k], vals[j]);
          var newVals = vals.filter((_, inx) => inx !== i && inx !== j);
          newVals.unshift(result);
          var newHistory = history.filter((_, inx) => inx !== i && inx !== j);
          newHistory.unshift('(' + history[i] + operations[k] + history[j] + ')');
          if (newVals.length === 1) {
            if (result === 24) {
              result24 = newHistory[0].substring(1, newHistory[0].length - 1);
              is24Found = true;
            }
          } else {
            f(newVals, newHistory);
          }
        }
      }
    }
  }

  permutationsWithEquals(args, perm => {
    f(perm, perm);
    return !is24Found;
  });

  return result24;
}


console.log(equalTo24(1,1,1,1,1,13));
console.log(equalTo24(4,4,2,2));

