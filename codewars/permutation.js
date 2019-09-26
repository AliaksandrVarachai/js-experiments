function permutation(n) {
  var a = new Int32Array(n);
  for (var i = 0; i < n; ++i)
    a[i] = i + 1;

  function next() {
    var i, j, k, t;
    i = n - 2;
    while (i >= 0 && a[i] > a[i + 1])
      --i;
    if (i < 0)
      return false;
    j = i + 1;
    while (j < n - 1 && a[j + 1] > a[i])
      ++j;
    t = a[i]; a[i] = a[j]; a[j] = t;
    k = n - 1;
    for (j = i + 1; j < k; ++j, --k) {
      t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return true;
  }

  console.log(a.join(''));
  while (next())
    console.log(a.join(''));
}


// "11122"
// "11212"
// "11221"
// "12112"
// "12121"
// "12211"
// "21112"
function permutationsWithEquals(a, compare = undefined) {
  var n = a.length;
  var s = a.slice();
  s.sort(compare);

  function next() {
    var i = n - 2;
    while (i >= 0 && s[i] >= s[i + 1]) // just '=' sign for equal elements!!!
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

  console.log(s.join(''));
  while (next()) {
    console.log(s.join(''));
  }
}

// n elements on n positions (elements of a will be used for output):
// "000"
// "001"
// "002"
// "010"
// "011"
// "012"...
function permutationsRepetition(a) {
  var n = a.length;
  var s = [];
  for (var i = 0; i < n; ++i)
    s.push(0);
  var inx = n - 1;

  function next() {
    if (s[inx] < n - 1) {
      ++s[inx];
    } else {
      for (var i = n - 1; i >= inx; --i)
        s[i] = 0;
      --inx;
      while (inx >= 0 && s[inx] === n - 1) {
        s[inx] = 0;
        --inx;
      }
      if (inx < 0)
        return false;
      ++s[inx];
      inx = n - 1;
    }
    return true;
  }

  console.log(s.map(i => a[i]).join(''));
  while(next())
    console.log(s.map(i => a[i]).join(''));
}

// "000"
// "001"
// "002"
// "010"
// "011"
// "012"
// "020"
// "021"
// "022"
function orderedSampleWithRepetition(a, k) { // k elements form a[] (k < a.length)
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

  console.log(s.map(i => a[i]).join(''));
  while(next())
    console.log(s.map(i => a[i]).join(''));
}


permutation(5);
permutationsWithEquals([1, 1, 2, 1, 2], (a, b) => a - b);
permutationsRepetition([7, 8, 9]);
orderedSampleWithRepetition([0, 1, 2], 3)