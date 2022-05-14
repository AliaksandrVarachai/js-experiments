module.exports = function maxSumOf(matrix) {
  const n = matrix.length;

  const sums = []; // helper 2D array
  for (let i = 0; i < n; ++i) {
    const row = [];
    for (let j = 0; j < n; ++j) {
      if (i === 0) {
        if (j === 0) row.push(matrix[0][0]);
        else row.push(matrix[0][j] + row[j - 1]);
      } else {
        if (j === 0) row.push(matrix[i][0] + sums[i - 1][0]);
        else row.push(matrix[i][j] + sums[i - 1][j] + row[j - 1] - sums[i - 1][j - 1]);
      }
    }
    sums.push(row);
  }

  // const sumSubmatrixORIGIN = (rowInx, colInx, width, height) => {
  //   let sum = 0;
  //   for (let i = rowInx; i < rowInx + height; ++i)
  //     for (let j = colInx; j < colInx + width; ++j) sum += matrix[i][j];
  //   return sum;
  // }
  const sumSubmatrix = (rowInx, colInx, width, height) => {
    const maxI = rowInx + height - 1;
    const maxJ = colInx + width - 1;
    if (rowInx === 0) {
      if (colInx === 0) return sums[maxI][maxJ];
      else {
        return sums[maxI][maxJ] - sums[maxI][colInx - 1];
      }
    } else {
      if (colInx === 0) return sums[maxI][maxJ] - sums[rowInx - 1][maxJ];
      else return sums[maxI][maxJ] - sums[rowInx - 1][maxJ] - sums[maxI][colInx - 1] + sums[rowInx - 1][colInx - 1];
    }
  }

  let maxSum = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < n; ++i) {
    for (let h = 1; h <= n - i; ++h) {
      for (let j = 0; j < n; ++j) {
        for (let w = 1; w <= n - j; ++w) {
          const sum = sumSubmatrix(i, j, w, h);
          if (maxSum < sum) maxSum = sum;
        }
      }
    }
  }
  return maxSum;
}

