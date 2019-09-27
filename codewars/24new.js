var operations = ['+', '-', '*', '/'];
var lowerLimit = 24 - 1e-9;
var upperLimit = 24 + 1e-9;

function operation(a, op, b) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
    default: throw('Unknown operator');
  }
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
            if (lowerLimit < result && result < upperLimit) {
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

  f(args, args);

  return result24;
}


console.log(equalTo24(1,1,1,1,1,13));
console.log(equalTo24(60,2,96,60));

