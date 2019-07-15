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
  var pathIndex = -1;
  if (boundNodes.length > 0) {
    // start with boundNodes[0] node
    pathIndex++;
    path[0] = boundNodes[0];
    traverseDFS(edges[boundNodes[0] - 1]);
    return pathIndex === n - 1 ? path : false;
  }
  // start with all nodes
  for (i = 0; i < maxSquare - 1 >> 1; i++) {
    pathIndex++;
    path[0] = i + 1;
    traverseDFS(edges[i]);
    if (pathIndex === n - 1)
      return path;
    pathIndex--;
  }

  function traverseDFS(links) {
    for (var i = 0; i < maxSquare - 1; i++) {
      //debugger;
      var toNode = links[i];
      if (0 < toNode && toNode <= n && path.indexOf(toNode) === -1) {
        pathIndex++;
        path[pathIndex] = toNode;
        if (pathIndex === n - 1)
          return;
        traverseDFS(edges[toNode - 1]);
        if (pathIndex === n - 1)
          return;
        path[pathIndex] = 0;
        pathIndex--;
      }
    }
  }

  var maxNumber = 1000;
  var bitArray = Int32Array(Math.ceil(maxNumber / 32)).fill(0); // 1024 bit max
  function setBit(b) {
    bitArray[b >> 5] |= 1 << (~(b >> 5) << 5); // 1 << b % 32;
  }

  function deleteBit(b) {
    bitArray[b >> 5] ^= 1 << (~(b >> 5) << 5); // 1 << b % 32;
  }

  function areFirstSet(x) {
    var lastFullBitNumber = x >> 5 - 1;
    var i;
    for (i = 0; i < lastFullBitNumber; i++) {
      if (bitArray[i] !== ~0)
        return false;
    }
    return (~0 >>> (x >> 5) | bitArray[i]) === ~0;  // 1 << b % 32;
  }



  return pathIndex === n - 1 ? path : false;
}