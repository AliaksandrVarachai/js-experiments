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
function calculateVisibility(size) {
  const permutations = generatePermutations(size);
  const visibleItems = [];
  for (let i = 0; i < size; ++i) {
    visibleItems.push([]);
    for (let j = 0; j < size; ++j) visibleItems[i].push([]);
  }

  for (let i = 0, len = permutations.length; i < len; ++i) {
    const perm = permutations[i];

    let visibleLeft = 1;
    let visibleRight = 1;

    let height = perm[0];
    for (let j = 1; j < size; ++j) {
      if (perm[j] > height) {
        ++visibleLeft;
        height = perm[i];
      }
    }
    height = perm[size - 1];
    for (let j = size - 1; j > -1; --j) {
      if (perm[j] > height) {
        ++visibleRight;
        height = perm[i];
      }
    }

    // visibleItems[visibleLeft - 1][visibleRight - 1].push(i);
    visibleItems[visibleLeft - 1][visibleRight - 1].push(toBinary(permutations[i]));
  }

  return visibleItems;
}

// generatePermutations(3).forEach(perm => console.log(perm.join()));

const visibleItems = calculateVisibility(3);
console.log('Visible items:');
printVisibleItems(visibleItems);


function printVisibleItems(visibleItems) {
  visibleItems.forEach((leftArr, leftInx) => {
    leftArr.forEach((rightArr, rightInx) => {
      // console.log(`${leftInx + 1}:${rightInx + 1} -> ${rightArr.join('; ')}`)
      console.log(`${leftInx}:${rightInx} -> ${rightArr.length ? rightArr.length + ' numbers' : ''}`);
    })
  });
}

// array max length is 8, max integer is 15;
function toBinary(arr) {
  let result = 0;
  for (let i = 0, l = arr.length; i < l; ++i)
    result |= arr[i] << 4 * i;
  return result;
}

// maxLen <= 8
function fromBinary(int, maxLen = 8) {
  const arr = [];
  for (let i = 0; i < maxLen; ++i) {
    const mask = 15 << (i << 2);
    const n = (int & mask) >>> (i << 2);
    arr.push(n);
  }
  return arr;
}

let b = toBinary([1,2,3,4,5,6,7,15]);
let arr = fromBinary(b, 8);

console.log(b, arr);



function solvePuzzle(clues) {
  const size = clues.length / 4;
  const visibleItems = calculateVisibility(size);
  const visibleClues = visibleItems.slice();

  visibleClues.unshift([visibleItems.flat(2)]); // 0:0
  for (i = 1; i <= size; ++i)
    visibleClues[0].push([]);
  for (let li = 1; li <= size; ++li) {
    for (let ri = 1; ri <= size; ++ri) {
      visibleClues[0][ri].push(...visibleItems[li - 1][ri - 1]);  //0:[1..size]
    }
  }
  for (let li = 1; li <= size; ++li) {
    visibleClues[li].unshift(visibleItems[li - 1].flat()); // [1..size]:0
  }

  // console.log('Visible clues:');
  // printVisibleItems(visibleClues);


  // top:button
  // const cols = [];
  // for (let i = 0; i < size; ++i) {
  //   const leftClue = clues[i];
  //   const rightClue = clues[3 * size - 1 - i];
  //   cols.push(visibleClues[leftClue][rightClue])
  // }
}

solvePuzzle([1,2,3,4,  1,2,3,4,  1,2,3,4,  1,2,3,4]);