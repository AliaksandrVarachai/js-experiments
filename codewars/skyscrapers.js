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
    visibleItems[visibleLeft - 1][visibleRight - 1].push(toBinary(perm));
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

// const visibleItems = generateVisibilities(3);
// console.log('Visible items:');
// printVisibleItems(visibleItems);
//
//
// function printVisibleItems(visibleItems) {
//   visibleItems.forEach((leftArr, leftInx) => {
//     leftArr.forEach((rightArr, rightInx) => {
//       // console.log(`${leftInx + 1}:${rightInx + 1} -> ${rightArr.join('; ')}`)
//       console.log(`${leftInx}:${rightInx} -> ${rightArr.length ? rightArr.length + ' numbers' : ''}`);
//     })
//   });
// }

// array max length is 8, max integer is 15;
function toBinary(arr) {
  let result = new Int32Array(2);
  for (let i = 0, l = arr.length; i < l; ++i)
    result[i < 4 ? 0 : 1] |= (1 << arr[i]) << (i << 3);
  return result;
}

// maxLen <= 8
function fromBinary(int32arr, maxLen = 8) {
  const arr = [];
  for (let i = 0; i < maxLen; ++i) {
    const mask = 255 << (i << 3);
    let n = (int32arr[i < 4 ? 0 : 1] & mask) >>> (i << 3);
    let p = 0;
    while(n > 1) {
      ++p;
      n >>= 1;
    }
    arr.push(p);
  }
  return arr;
}

function isSimilarBinaries(arr1, arr2) {
  return (arr1[0] & arr2[0]) || (arr1[1] & arr2[1]);
}


// binArr: size x size
function checkHorizontalLines(binArr, clues) {
  const size = binArr.length;
  const binArrTransposed = new Int32Array(size);
  for (let pos = 0; pos < size; ++pos) {
    mask = 15 << (pos << 2);
    for (let i = 0; i < size; ++i)
      binArrTransposed[i] |= mask & binArr[i];
  }

  for (let i = 0; i < size; ++i) {
    const leftClue = clues[4 * size - 1 - i];
    const rightClue = clues[size + i];
    if (leftClue > 0 && leftClue !== getLeftVisibleItems(binArrTransposed[i])) return false;
    if (rightClue > 0 && rightClue !== getRightVisibleItems(binArrTransposed[i])) return false;
    for (let j = 0; j < i; ++j) {
      if (isSimilarBinaries(binArrTransposed[i], binArrTransposed[j])) return false;
    }
  }

  return true;
}



function solvePuzzle(clues) {
  const size = clues.length / 4;
  const visibleItems = generateVisibilities(size);
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

  // Generates graph with possible skyscrapers combinations
  const graph = [];
  const graphLengths = [];
  const graphIndexes = new Int32Array(size);

  for (let colInx = 0; colInx < size; ++colInx) {
    const leftClue = clues[colInx];
    const rightClue = clues[3 * size - 1 - colInx];
    graph.push(visibleClues[leftClue][rightClue]);
    graphLengths.push(graph[colInx].length);
  }

  let colInx = 0;
  while (true) {
    if (colInx === size) {
      // vertical checks are passed
      console.log('Vertical checks are passed');
      const binArr = graph.map((col, i) => col[graphIndexes[i]]);
      if (checkHorizontalLines(binArr, clues)) {
        console.log('Horizontal checks are passed');
        return transpose(binArr.map(binNumber => fromBinary(binNumber, size)));
      } else {
        --colInx;
        ++graphIndexes[colInx];
        // continue;
      }
    }
    let graphInx = graphIndexes[colInx];
    if (graphInx === graphLengths[colInx]) {
      graphIndexes[colInx] = 0;
      --colInx;
      if (colInx < 0) throw Error('Skyscrapers combination is not found');
      ++graphIndexes[colInx];
      continue;
    }
    if (colInx === 0) {
      colInx = 1;
      continue;
    }

    let isPossible = true;
    for (let i = 0; i < colInx; ++i) {
      // console.log(`[${fromBinary(graph[colInx][graphInx])}] & [${fromBinary(graph[i][graphIndexes[i]])}] => ${isSimilarBinaries(graph[colInx][graphInx], graph[i][graphIndexes[i]])}`);
      if (isSimilarBinaries(graph[colInx][graphInx], graph[i][graphIndexes[i]])) {
        // checks compatibility with previous skyscrapers (vertical lines)
        isPossible = false;
        break;
      }
    }
    if (isPossible) {
      ++colInx;
    } else {
      ++graphIndexes[colInx];
    }
  }
}

// transposes a square matrix
function transpose(matr) {
  const m = matr.length;
  const n = matr[0].length;
  const t = matr.map(row => row.slice());
  for (let i = 0; i < m - 1; ++i) {
    for (let j = i + 1; j < n; ++j) {
      [t[i][j], t[j][i]] = [t[j][i], t[i][j]];
    }
  }
  return t;
}

var clues1 = [0,0,1, 0,0,0, 0,0,0, 0,0,0];
var clues2 = [1,2,3,4,  1,2,3,4,  1,2,3,4,  1,2,3,4]

var result = solvePuzzle(clues1);
result.forEach(row => console.log(`[${row}]`));
