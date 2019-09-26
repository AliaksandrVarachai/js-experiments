var operations = ['+', '-', '*', '/'];

function operation(a, b, op) {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
    default: throw('Unknown operator');
  }
}

function equalTo24(a, b, c, d) {
  var result24 = "It's not possible!";
  var is24Found = false;
  var history = [];

  // all permutations of [abcd]
  function f(str, ...args) {
    if (is24Found)
      return;
    // console.log(str, args);

    for (var i = 0; i < args.length; ++i) {
      for (var j = 0; j < args.length; ++j) {
        if (i === j)
          continue;
        for (var k = 0; k < operations.length; ++k) {
          var result = operation(args[i], args[j], operations[k]);
          // TODO: compare with history length????
          var lastInx = history.length - 1;
          if (i === history.len) {
            history[lastInx] = `(${history[lastInx]}${operations[k]}${args[j]})`;
          } else if (j === 0) {
            history[lastInx] = `(${args[i]}${operations[k]}${history[lastInx]})`;
          } else {
            history.push(`(${args[i]}${operations[k]}${args[j]})`)
          }

          // newStr = str + '(' + args[i] + operations[k] + args[j] + ')';
          if (args.length === 2) {
            if (result === 24) {
              result24 = newStr;
              is24Found = true;
            }
          } else {
            f(newStr, result, ...args.filter((_, inx) => inx !== i && inx !== j));
          }
        }
      }
    }
  }

  f('', a, b, c, d);

  return result24;
}


console.log(equalTo24(1,1,13,1))

console.log(equalTo24(4,4,2,2))









