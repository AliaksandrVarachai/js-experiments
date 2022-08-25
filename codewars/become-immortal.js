function elderAgeSimple(m,n,l,t) {
  let sum = 0;
  const array = [];
  for (let i = 0; i < n; ++i) {
    const row = [];
    for (let j = 0; j < m; ++j) {
      const value = j ^ i;
      row.push(value);
      if (value > l) sum += value - l;
    }
    array.push(row);
  }
  // console.log(`${m}x${n}:`);
  // array.forEach(row => console.log(row.join(',')))
  return sum % t;
}

function elderAge(m,n,l,t) {
  let sum = 0;
  cutSquare();
  return sum % t;

  function cutSquare(startColInx = 0, startRowInx = 0, endColInx = m - 1, endRowInx = n - 1) {
    console.log('cutSquare', startColInx, startRowInx, endColInx, endRowInx)
    if (startColInx > endColInx || startRowInx > endRowInx) return;
    const colsB = (endColInx - startColInx + 1).toString(2); // Math.log2(endColInx - startColInx + 1)
    const rowsB = (endRowInx - startRowInx + 1).toString(2);
    const colsNumberMax2Power = colsB.length - 1;
    const rowsNumberMax2Power = rowsB.length - 1;
    if (colsNumberMax2Power < rowsNumberMax2Power) {
      const elementsInSquareSide = 2 ** colsNumberMax2Power;
      const rowsNumber = endRowInx - startRowInx + 1;
      const r = rowsNumber % elementsInSquareSide;
      const repeated = (rowsNumber - r) / elementsInSquareSide;
      console.log('repeated=', repeated)
      for (let i = 0; i < repeated; ++i) {
        sum += getSquareSum(startColInx, startRowInx + i * elementsInSquareSide, elementsInSquareSide);
      }
      // bottom rectangle:
      const startColInx1 = startColInx;
      const startRowInx1 = startRowInx + repeated * elementsInSquareSide - 1;
      const endColInx1 = startColInx + elementsInSquareSide;
      const endRowInx1 = endRowInx;
      cutSquare(startColInx1, startRowInx1, endColInx1, endRowInx1);
      // right & bottom rectangle:
      const startColInx2 = startColInx + elementsInSquareSide;
      const startRowInx2 = startRowInx;
      const endColInx2 = endColInx;
      const endRowInx2 = endRowInx;
      cutSquare(startColInx2, startRowInx2, endColInx2, endRowInx2);
    } else {
      const elementsInSquareSide = 2 ** rowsNumberMax2Power;
      const colsNumber = endColInx - startColInx + 1;
      const r = colsNumber % elementsInSquareSide;
      const repeated = (colsNumber - r) / elementsInSquareSide;
      console.log('repeated=', repeated, colsNumber, endColInx, startColInx)
      for (let i = 0; i < repeated; ++i) {
        sum += getSquareSum(startColInx + i * elementsInSquareSide, startRowInx, elementsInSquareSide);
      }
      // bottom rectangle:
      const startColInx1 = startColInx;
      const startRowInx1 = startRowInx + elementsInSquareSide;
      const endColInx1 = startColInx + repeated * elementsInSquareSide - 1;
      const endRowInx1 = endRowInx;
      cutSquare(startColInx1, startRowInx1, endColInx1, endRowInx1);
      // right & bottom rectangle:
      const startColInx2 = startColInx + repeated * elementsInSquareSide;
      const startRowInx2 = startRowInx;
      const endColInx2 = endColInx;
      const endRowInx2 = endRowInx;
      cutSquare(startColInx2, startRowInx2, endColInx2, endRowInx2);
    }

  }

  function getSquareSum(colInx, rowInx, elementsInRow) {
    console.log(colInx, rowInx, elementsInRow)
    const min = colInx ^ rowInx;
    if (elementsInRow === 1) return l < min ? min - l : 0;
    const max = min + elementsInRow - 1;
    if (l >= max) {
      return 0;
    }
    if (l <= min) {
      return elementsInRow * elementsInRow / 2 * (min - l + max - l);
    }
    return elementsInRow * (max - l + 1) / 2 * (max - l);
  }
}


module.exports = {
  elderAgeSimple,
  elderAge,
}
