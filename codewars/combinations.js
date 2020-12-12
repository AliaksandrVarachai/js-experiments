const m = 4;
const n = 3;


// without functions
/*
  const a = [];
  for (let i = 0; i < n; ++i) a.push(i);

  while (true) {
    console.log(a);
    let i = n - 1;
    while (i >= 0 && a[i] === m - (n - i)) {
      --i;
    }
    if (i < 0) break;
    ++a[i];
    for (let j = 1; i + j < n; ++j) {
      a[i + j] = a[i] + j;
    }
  }
*/


/**
 * Generates all combinations [0..n-1] for the set of integers [0..m-1].
 * @param {number} n - number elements in the ONE combination.
 * @param {number} m - total elements number.
 * @returns {function(): ([number]|null)}
 */
function createCombinationGenerator(n, m) {
  const a = [];
  let isInitialized = false;

  return function nextCombination() {
    if (!isInitialized) {
      isInitialized = true;
      for (let i = 0; i < n; ++i) a.push(i);
      return a.slice();
    }

    // next iteration
    let i = n - 1;
    while (i >= 0 && a[i] === m - (n - i)) {
      --i;
    }
    if (i < 0) return null;
    ++a[i];
    for (let j = 1; i + j < n; ++j) {
      a[i + j] = a[i] + j;
    }

    return a.slice();
  }
}

const nextCombination = createCombinationGenerator(n, m);
let combination;
do {
  combination = nextCombination();
  console.log(combination);
} while (combination)





