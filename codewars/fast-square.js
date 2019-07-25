// See https://github.com/FluorineDog/square_sum
function findPath(n) {
  // n=60: [1,3,6,10,15,21,4,5,11,14,50,31,18,7,2,34,30,19,45,36,13,51,49,32,17,47,53,28,8,56,25,39,42,58,23,41,59,22,27,54,46,35,29,20,44,37,12,52,48,33,16,9,55,26,38,43,57,24,40,60]
  var base25 = [2,23,13,12,24,25,11,14,22,3,1,8,17,19,6,10,15,21,4,5,20,16,9,7,18];
  if (n < 26) {
    switch(n) {
      case 15: return [8,1,15,10,6,3,13,12,4,5,11,14,2,7,9];
      case 16: return [8,1,15,10,6,3,13,12,4,5,11,14,2,7,9,16];
      case 17: return [16,9,7,2,14,11,5,4,12,13,3,6,10,15,1,8,17];
      case 23: return [2,23,13,12,4,21,15,10,6,19,17,8,1,3,22,14,11,5,20,16,9,7,18];
      case 25: return base25;
      default: return false;
    }
  }

  //var squares = [];
  var squareBases = {};
  for (var squareBase = 2, maxSquare = Math.floor(Math.sqrt(n * (n - 1))); squareBase <= maxSquare; squareBase++) {
    var square = squareBase * squareBase;
    //squares.push(square);
    squareBases[square] = squareBase
  }


  function checkSquareSum(x, y) {
    return !!squareBases[x + y];
  }


  function randomInvariantOperations() {
    var operationCode = Math.floor(Math.random() * 8); // 8 = 2^3 - number of operation permutations

    switch(operationCode) {
      case 0:
        [b, a] = [a, b];
        break;
      case 1:
        a.reverse();
        break;
      case 2:
        b.reverse();
        break;
      case 3:
        [b, a] = [a, b];
        a.reverse();
        break;
      case 4:
        [b, a] = [a, b];
        b.reverse();
        break;
      case 5:
        a.reverse();
        b.reverse();
        break;
      case 6:
        [b, a] = [a, b];
        a.reverse();
        b.reverse();
        break;
      default:
        // no operations
    }
  }

  function checkEndPoints() {
    if (checkSquareSum(a[0], b[0]))
      return [0, 0];
    if (checkSquareSum(a[a.length - 1], b[0]))
      return [1, 0];
    if (checkSquareSum(a[0], b[b.length - 1]))
      return [0, 1];
    if (checkSquareSum(a[a.length - 1], b[b.length - 1]))
      return [1, 1];
    return false;
  }

  // return -1 if there is not such place
  function getRandomIndexWithSquareSum() {
    var aLen = a.length;
    var startIndex = Math.floor(Math.random() * aLen);
    var i = startIndex;
    while (i < aLen) {
      if (checkSquareSum(a[i], b[0]))
        return i;
      i++;
    }
    if (aLen === 1)
      return -1;
    i = 0;
    while (i < startIndex) {
      if (checkSquareSum(a[i], b[0]))
        return i;
      i++;
    }
    return -1;
  }

  var a = base25;
  var b;

  function appendNextNumber() {
    b = [a.length + 1];

    var checkEndPointsResult = checkEndPoints();
    while(!checkEndPointsResult) {
      randomInvariantOperations();
      var splitIndex = getRandomIndexWithSquareSum();
      if (splitIndex < 0)
        continue;
      var c = a.slice(0, splitIndex + 1);
      var d = a.slice(splitIndex + 1);
      a = c;
      a.push(...b);
      b = d;
      checkEndPointsResult = checkEndPoints();
    }
    var [aInx, bInx] = checkEndPointsResult;
    if (aInx === 0) {
      if (bInx === 0) {
        a.unshift(...b.reverse());
      } else {
        a.unshift(...b);
      }
    } else {
      if (bInx === 0) {
        a.push(...b);
      } else {
        a.push(...b.reverse());
      }
    }
    b = [a.length + 1]; // ready for next iteration
  }

  for (var i = a.length + 1; i <= n; i++) {
    appendNextNumber();
  }

  return a;
}

console.log(findPath(2000).join(','))