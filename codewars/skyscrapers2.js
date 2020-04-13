function generatePermutations(size = 6) {
  const permutations = [];
  const row = [];

  for (let i = 1; i <= size; ++i) row.push(i);

  permutations.push(row.slice());

  while (true) {
    let i = size - 2;
    while (i > -1 && row[i] > row[i + 1]) --i;
    if (i === -1) return permutations;
    //i - эл-т нарушающий убывающую последовательность
    let j = i + 1;
    while (j < size && row[j] > row[i]) ++j;
    // j - 1 - эл-т с которым меняем нарушающий эл-т
    [row[i], row[j - 1]] = [row[j - 1], row[i]];
    for (let k = i + 1, d = size - 1; k < d; ++k, --d)
      [row[k], row[d]] = [row[d], row[k]];
    // начиная с i + 1 все элементы теперь упорядочены по возрастанию
    permutations.push(row.slice());
  }

  return permutations;
}

/**
 * Generates permutations and collects them in the structure [L][R][permutationInx]: [0..size-1][0..size-1][number]
 * @param size {number} - number of skyscrapers.
 * @returns {[[[number]]]}
 */
function generateVisibilities(size) {
  const permutations = generatePermutations(size);
  const visibleItems = [];

  for (let i = 0; i < size; ++i) {
    visibleItems.push([]);
    for (let j = 0; j < size; ++j) visibleItems[i].push([]);
  }

  for (let i = 0, len = permutations.length; i < len; ++i) {
    const perm = permutations[i];
    const visibleLeft = getLeftVisibleItems(perm);
    const visibleRight = getRightVisibleItems(perm);
    visibleItems[visibleLeft - 1][visibleRight - 1].push(perm);
    // visibleItems[visibleLeft - 1][visibleRight - 1].push(toBinary(perm));
  }

  return visibleItems;
}

function getLeftVisibleItems(perm) {
  const size = perm.length;
  let visibleLeft = 1;
  let height = perm[0];
  for (let j = 1; j < size; ++j) {
    if (perm[j] > height) {
      ++visibleLeft;
      height = perm[j];
    }
  }
  return visibleLeft;
}

function getRightVisibleItems(perm) {
  const size = perm.length;
  let visibleRight = 1;
  let height = perm[size - 1];
  for (let j = size - 1; j > -1; --j) {
    if (perm[j] > height) {
      ++visibleRight;
      height = perm[j];
    }
  }
  return visibleRight;
}

function printVisibleItems(visibleItems) {
  visibleItems.forEach((leftArr, leftInx) => {
    leftArr.forEach((rightArr, rightInx) => {
      // console.log(`${leftInx + 1}:${rightInx + 1} -> ${rightArr.join('; ')}`)
      console.log(`${leftInx}:${rightInx} -> ${rightArr.length ? rightArr.length + ' numbers' : ''}`);
    })
  });
}

function flatDeep(arr) {
  const result = [];

  (function flat(a) {
    if (!Array.isArray(a)) {
      result.push(a);
      return;
    }
    for (let i = 0, l = a.length; i < l; ++i)
      flat(a[i]);
  })(arr);

  return result;
}

function solvePuzzle(clues) {
  const size = clues.length / 4;
  const visibleItems = generateVisibilities(size);
  const visibleClues = visibleItems.slice();

  visibleClues.unshift([flatDeep(visibleItems)]); // 0:0
  for (let i = 1; i <= size; ++i)
    visibleClues[0].push([]);
  for (let li = 1; li <= size; ++li) {
    for (let ri = 1; ri <= size; ++ri) {
      visibleClues[0][ri].push(...visibleItems[li - 1][ri - 1]);  //0:[1..size]
    }
  }
  for (let li = 1; li <= size; ++li) {
    visibleClues[li].unshift(flatDeep(visibleItems[li - 1])); // [1..size]:0
  }

  printVisibleItems(visibleClues);

}

let clues1 = [0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0,];
solvePuzzle(clues1);




