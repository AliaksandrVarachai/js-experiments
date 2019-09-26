function sampleWithRepetition(a, k, cb) { // k < n
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

  if (!cb(s.map(i => a[i])))
    return;
  while(next())
    if (!cb(s.map(i => a[i])))
      return;
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

var k = 3;
var vals = [1, 2, 3, 4];
var r = [];
var result = 'Not possible!';

sampleWithRepetition(['+', '-', '*', '/'], k, (ops) => {
  r[0] = vals[0];
  for (var i = 1; i <= k; ++i) {
    r[i] = operation(r[i - 1], vals[i], ops[i - 1]);
  }
  if (r[k] === 24) {
    var priority = priorities[ops[0]];
    var str = '' + vals[0] + ops[0] + vals[1];
    for (var i = 1; i < k; ++i) {
      if (priorities[ops[i]] < priority) {
        str = '(' + str + ')';
        priority = priorities[ops[i]];
      }
      str += ops[i] + vals[i + 1];
    }
    result = str;
    return false;
  }
  return true;
});

console.log('result: ' + result);










