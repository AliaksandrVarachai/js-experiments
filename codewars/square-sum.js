function square_sums_row(n){
  var maxSquare = ~~Math.sqrt(2 * n - 1);
  var squares = new Int32Array(maxSquare - 1);
  var i, j;
  for (i = 2; i <= maxSquare; i++) {
    squares[i - 2] = i * i;
  }
  var edges = new Array(n);
  for (i = 0; i < n; i++) {
    edges[i] = new Int32Array(maxSquare - 1);
    for (j = 0; j < maxSquare - 1; j++) {
      edges[i][j] = squares[j] - i - 1;
    }
  }

  //check for the possibility to visit all nodes
  var numberOfLinks = new Int32Array(n).fill(0);
  for (i = 0; i < n; i++) {
    for (j = 0; j < maxSquare - 1; j++) {
      var toNode = edges[i][j];
      if (0 < toNode && toNode <= n) {
        numberOfLinks[toNode - 1]++;
      }
    }
  }
  var boundNodes = [];
  for (i = 0; i < n; i++) {
    if (numberOfLinks[i] === 0)
      return false;
    if (numberOfLinks[i] === 1) {
      if (boundNodes.length === 2)
        return false;
      boundNodes.push(i + 1);
    }
  }

  //traverse all nodes
  var path = new Array(n).fill(0);
  var bitPath = new Int32Array(Math.ceil(n / 32)).fill(0); // 32 x 32 = 1024 bit maximum (to fast check path elements)
  var pathIndex = -1;
  if (boundNodes.length > 0) {
    // start with boundNodes[0] node
    console.log(`fast ${n}:${i}`)
    pathIndex++;
    path[0] = boundNodes[0];
    setPathBit(boundNodes[0]);
    traverseDFS(edges[boundNodes[0] - 1]);
    return pathIndex === n - 1 ? path : false;
  }
  // brute force checke for all nodes
  for (i = 0; i < maxSquare - 1 >> 1; i++) {
    console.log(`brute force ${n}:${i}`);
    pathIndex++;
    path[0] = i + 1;
    setPathBit(i + 1);
    traverseDFS(edges[i]);
    if (pathIndex === n - 1)
      return path;
    clearPathBit(i + 1);
    pathIndex--;
  }

  function traverseDFS(links) {
    for (var i = 0; i < maxSquare - 1; i++) {
      var toNode = links[i];
      if (0 < toNode && toNode <= n && !checkPathBit(toNode)) {
        pathIndex++;
        path[pathIndex] = toNode;
        setPathBit(toNode);
        if (pathIndex === n - 1)
          return;
        traverseDFS(edges[toNode - 1]);
        if (pathIndex === n - 1)
          return;
        path[pathIndex] = 0;
        clearPathBit(toNode);
        pathIndex--;
      }
    }
  }

  function setPathBit(b) {
    bitPath[b >> 5] |= 1 << (b << 27 >>> 27); // 1 << b % 32;
  }

  function checkPathBit(x) {
    return bitPath[x >> 5] & 1 << (x << 27 >>> 27);
  }

  function clearPathBit(b) {
    bitPath[b >> 5] &= ~(1 << (b << 27 >>> 27)); // 1 << b % 32;
  }

  function checkFullPath(x) {
    var lastFullBitNumber = x >> 5;
    var i;
    for (i = 0; i < lastFullBitNumber; i++) {
      if (bitPath[i] ^ ~0)
        return false;
    }
    var mask = ~(~0 << (x << 27 >>> 27));
    return !(bitPath[i] ^ mask);
  }

  return pathIndex === n - 1 ? path : false;
}

console.log(square_sums_row(25).join(','));

// for n = 46:
var results = [];
results.length = 1024;
results[0] = [];
results[1] = [];
results[2] = [];

results[46] = [1,3,6,10,15,21,28,8,17,32,4,5,11,14,2,34,30,19,45,36,13,12,24,25,39,42,22,27,37,44,20,16,33,31,18,46,35,29,7,9,40,41,23,26,38,43];
results[47] = [1,3,6,10,15,21,4,32,17,47,2,34,30,19,45,36,28,8,41,40,9,7,29,20,16,33,31,18,46,35,14,11,5,44,37,27,22,42,39,25,24,12,13,23,26,38,43];
results[48] = [1,3,6,10,15,21,4,32,17,47,2,34,30,19,45,36,28,8,41,40,9,7,29,20,16,48,33,31,18,46,35,14,11,5,44,37,27,22,42,39,25,24,12,13,23,26,38,43];
