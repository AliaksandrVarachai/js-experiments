// if a = [1123] returns [1123], [1132], [1213], [1231], ..., [3211]
// stops when cb returns false
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

// generates [+++], [++-], [++*], [++/], ..., [///]
// k - sample size (k <= a.length)
// stops when cb returns false
function sampleWithRepetition(a, k, cb) {
  var n = a.length;
  var s = [];
  for (var i = 0; i < k; ++i)
    s.push(0);
  var inx = k - 1;

  function next() {
    if (s[inx] < n - 1) {
      ++s[inx];
    } else {
      for (var i = k - 1; i >= inx; --i)
        s[i] = 0;
      --inx;
      while (inx >= 0 && s[inx] === n - 1) {
        s[inx] = 0;
        --inx;
      }
      if (inx < 0)
        return false;
      ++s[inx];
      inx = k - 1;
    }
    return true;
  }

  do {
    if (!cb(s.map(i => a[i]))) return;
  } while (next());
}

var priorities = {
  '*': 0,
  '/': 0,
  '+': 1,
  '-': 1
};

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
  var result = "It's not possible!";
  var opsN = arguments.length - 1;  // operations number

  // find all permutations of a, b, c, d
  var valPermutations = [];
  permutationsWithEquals([a, b, c, d], (perm) => {
    valPermutations.push(perm.slice());
    return true;
  });

  var orderPermutations = [];
  permutationsWithEquals([0, 1, 2], (order) => {
    orderPermutations.push(order.slice());
    return true;
  });

  var r = []; // stores intermediate results

  sampleWithRepetition(['+', '-', '*', '/'], opsN, (ops) => {
    var i, j, k,
        valN = valPermutations.length;
        orderN = orderPermutations.length;
    for (j = 0; j < valN; ++j) {
      for (k = 0; k < orderN; ++k) {
        var vals = valPermutations[j];
        var order = orderPermutations[k];
        // debugger;
        r[0] = vals[0];
        for (i = 1; i <= opsN; ++i) {
          r[i] = operation(r[i - 1], vals[i], ops[order[i - 1]]);
        }

        var str = '' + vals[0] + ops[order[0]] + vals[1];
        for (i = 1; i < opsN; ++i) {
          str += ops[order[i]] + vals[i + 1];
        }
        console.log(`${str}=${r[opsN]}`)

        if (r[opsN] === 24) {
          var priority = priorities[ops[0]];
          var str = '' + vals[0] + ops[0] + vals[1];
          for (i = 1; i < opsN; ++i) {
            if (priorities[ops[i]] < priority) {
              str = '(' + str + ')';
              priority = priorities[ops[i]];
            }
            str += ops[i] + vals[i + 1];
          }
          result = str;
          return false;
        }
      }
    }
    return true;
  });

  return result;
}



console.log(equalTo24(1,1,1,13));










