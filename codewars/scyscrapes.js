var n = 4;             // size of the grid
var permutations = []; // { perm, leftSeen, rightSeen, mask }

function generatePermutations() {
  var a = [];
  for (var i = 0; i < n; ++i)
    a.push(i + 1);

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

  function pushToPermutations(p) {
    permutations.push({
      perm: p.slice(),
      left: getLeftSeen(p),
      right: getRightSeen(p),
      mask: getMask(p)
    });
  }

  pushToPermutations(a);
  while (next())
    pushToPermutations(a);
}

function getLeftSeen(p) {
  var seen = 1, maxH = p[0];
  for (var i = 1; i < p.length; ++i)
    if (p[i] > maxH) {
      maxH = p[i];
      ++seen;
    }
  return seen;
}

function getRightSeen(p) {
  var seen = 1, maxH = p[p.length - 1];
  for (var i = p.length - 2; i > -1; --i)
    if (p[i] > maxH) {
      maxH = p[i];
      ++seen;
    }
  return seen;
}

function getMask(p) {
  return (1 << 24) + p[0] + (1 << 16) + p[1] + (1 << 8) + p[2] + (1 << 0) + p[3];
}

generatePermutations();
//console.log(permutations)

function solvePuzzle (clues) {
  // check horizontal clues
  var i, k, pIndexes = [];
  for (i = 0; i < n; ++i)
    pIndexes.push([]);
  for (i = 0, len = permutations.length; i < len; ++i) {
    var p = permutations[i];
    for (k = 0; k < n; ++k) {
      if (p.left === clues[15 - k] && p.right === clues[4 + k])
        pIndexes[0].push(i);
    }
  }
  for (var i0 = 0; i0 < pIndexes[0].length; ++i0) {
    var p0 = permutations[i0];
    for (var i1 = 0; i1 < pIndexes[1].length; ++i1) {
      var p1 = permutations[i1];
      if (p0.mask & p1.mask)
        continue;
      for (var i2 = 0; i2 < pIndexes[2].length; ++i2) {
        var p2 = permutations[i2];
        if (p0.mask & p2.mask || p1.mask & p2.mask)
          continue;
        for (var i3 = 0; i3 < pIndexes[3].length; ++i3) {
          var p3 = permutations[i3];
          if (p0.mask & p3.mask || p1.mask & p3.mask || p2.mask & p3.mask)
            continue;
          // check vertical permutations
          var isOK = true;
          for (k = 0; k < n; ++k) {
            var vp = [p0.perm[k], p1.perm[k], p2.perm[k], p3.perm[k]];
            if (clues[k] !== getLeftSeen(vp) || clues[11 - k] !== getRightSeen(vp)) {
              isOK = false;
              break;
            }
          }
          if (isOK)
            return [p0.perm, p1.perm, p2.perm, p3.perm];
        }
      }
    }
  }
}


// tests

var clues = [2, 2, 1, 3,
  2, 2, 3, 1,
  1, 2, 2, 3,
  3, 2, 1, 3];

var result = solvePuzzle(solvePuzzle);
console.log(result);
