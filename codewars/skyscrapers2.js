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

function checkParallelLines(lines, newLine) {
  for (let i = 0, size = lines.length; i < size; ++i) {
    const line = lines[i];
    if ((line[0] & newLine[0]) || (line[1] & newLine[1])) return false;
  }
  return true;
}

function checkPerpendicularLines(lines, perpendicular) {
  for (let i = 0, size = lines.length; i < size; ++i) {
    if (lines[0] & lines[1] === 0) continue;
    const inx = i < 4 ? 0 : 1;
    const mask = 255 << (i << 3);
    if (lines[i][inx] & mask !== perpendicular[inx] & mask) return false;
  }
  return true;
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

  // prepare clues for enumeration in order according their items
  const sortedCluePairs = [];
  for (let i = 0; i < size; ++i) {
    const left = clues[i];                  // top
    const right = clues[3 * size - 1 - i];  // bottom
    sortedCluePairs.push({
      isVert: true,
      inx: i,
      left,
      right,
      itemsNumber: visibleClues[left][right].length
    });
  }
  for (let i = 0; i < size; ++i) {
    const left = clues[4 * size - 1 - i];
    const right = clues[size + i];
    sortedCluePairs.push({
      isVert: false,
      inx: i,
      left,
      right,
      itemsNumber: visibleClues[left][right].length
    });
  }
  sortedCluePairs.sort((a, b) => a.itemsNumber - b.itemsNumber);

  const verticals = [];
  const horizontals = [];

  const currentVisibleClueIndexes = [];
  for (let li = 0; li <= size; ++li) {
    currentVisibleClueIndexes.push([]);
    for (let ri = 0; ri <= size; ++ri) {
      currentVisibleClueIndexes[li].push(0);
    }
  }


  let clueIndex = 0;
  while (true) {
    if (clueIndex < 0) {
      throw Error('Target block of skyscrapers is impossible.');
    }
    if (clueIndex === size * 2) {
      return horizontals.map(line => fromBinary(line, size));
    }
    const cluePair = sortedCluePairs[clueIndex];
    const { isVert, inx, left, right } = cluePair;
    if (currentVisibleClueIndexes[left][right] === cluePair.itemsNumber) {
      currentVisibleClueIndexes[left][right] = 0;
      --clueIndex;
    }

    const currentVisibleClueIndex = currentVisibleClueIndexes[left][right];
    const lines = isVert ? verticals : horizontals;
    const perpendicularLines = isVert ? horizontals : verticals;
    const newLine = visibleClues[left][right][currentVisibleClueIndex];

    // checks vertical and horizontal intersections
    if (checkParallelLines(lines, newLine) && checkPerpendicularLines(perpendicularLines, newLine)) {
      ++clueIndex;
      lines[inx] = newLine;
    } else {
      ++currentVisibleClueIndexes[left][right];
    }
  }

}

let clues1 = [0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0,];

let result = solvePuzzle(clues1);
result.forEach(line => console.log(`[${line}]`));




