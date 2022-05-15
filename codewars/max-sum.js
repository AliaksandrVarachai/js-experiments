function maxSumOfOld(matrix) {
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

module.exports = function maxSumOf(matrix) {
  var n = matrix.length;

  // case when the matrix does not contain any positive elements
  var areNonPositiveElements = true;
  var maxNonPositiveElement = Number.NEGATIVE_INFINITY;
  for (var i = 0; i < n; ++i) {
    if (!areNonPositiveElements) break;
    for (var j = 0; j < n; ++j) {
      if (matrix[i][j] > 0) {
        areNonPositiveElements = false;
        break;
      } else if (maxNonPositiveElement < matrix[i][j]) {
        maxNonPositiveElement = matrix[i][j];
      }
    }
  }
  if (areNonPositiveElements) return maxNonPositiveElement;

  // 2D array each element is a sum of [0,0]-[i,j] submatrix.
  var sums = [];
  for (var i = 0; i < n; ++i) {
    var row = [];
    for (var j = 0; j < n; ++j) {
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


  function getSubmatrixSum (rowInx, colInx, height) {
    var maxI = rowInx + height - 1;
    var maxJ = colInx;
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


  // Kagane's algorithm providing O(n^3) complexity
  var maxSum = Number.NEGATIVE_INFINITY;
  for (var i = 0; i < n; ++i) {
    for (var h = 1; h <= n - i; ++h) {
      var currentSum = 0;
      for (var j = 0; j < n; ++j) {
        currentSum += getSubmatrixSum(i, j, h)
        if (currentSum < 0) currentSum = 0;
        if (currentSum > maxSum) maxSum = currentSum;
      }
    }
  }
  return maxSum;
}

