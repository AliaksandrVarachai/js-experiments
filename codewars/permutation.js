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

  console.log(a.join(','));
  while (next())
    console.log(a.join(','));
}


function permutationsWithEquals(a, compare = undefined) {
  var n = a.length;
  var s = a.slice()
  s.sort(compare);

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

  console.log(s);
  while (next()) {
    console.log(s);
  }
}


permutation(5);
permutationsWithEquals([1, 1, 2, 1, 2], (a, b) => a - b);