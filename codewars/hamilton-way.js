var maxNumber = 1000;
var maxMumberOfSquares = ~~Math.sqrt(maxNumber - 1);
var memoizedSquares = new Array(maxMumberOfSquares - 1);
for (var i = 2; i <= maxMumberOfSquares; i++) {
  memoizedSquares[i - 2] = i * i;
}

var bound = 25;

var edges;


function createGraphEdges(n) {
  var i, z, pairs;
  if (n <= bound) {
    edges = new Array(n);
    for (i = 0; i < n; i++) {
      z = 0;
      while(memoizedSquares[z] <= i + 1) {
        z++;
      }
      pairs = [];
      if (i === n - 1) {
        while (memoizedSquares[z] <= n + n - 1) {
          pairs.push(memoizedSquares[z] - (i + 2));
          z++;
        }
      } else {
        while (memoizedSquares[z] <= n + i + 1) {
          if (memoizedSquares[z] !== 2 * (i + 1))
            pairs.push(memoizedSquares[z] - (i + 2));
          z++;
        }
      }
      edges[i] = pairs;
    }
  } else {
    createGraphEdges(bound); // TODO: optimize with predefined value
    var pairsMaxLen = 2;
    for (i = bound; i < n; i++) {
      z = 0;
      while(memoizedSquares[z] <= i + 1) {
        z++;
      }
      pairs = [];
      while (memoizedSquares[z] <= n + i + 1 && pairs.length < pairsMaxLen) {
        if (memoizedSquares[z] !== 2 * (i + 1)) {
          var pairNumber = memoizedSquares[z] - (i + 2); // index => -1
          pairs.push(pairNumber);
          if (edges[pairNumber].indexOf(i) < 0) {
            edges[pairNumber].push(i);
          }
        }
        z++;
      }
      edges[i] = pairs;
    }
  }
}



function getHamiltonPath() {
  var n = edges.length;
  var path = [];
  var pathLen = 0;

  for (var i = 0; i < edges.length; i++) {
    pathLen++;
    path.push(i);
    if (parse(edges[i]))
      return path.map(function(val) { return val + 1; });
    pathLen--;
    path.pop(i);
  }

  return false;

  function parse(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var nextNodeIndex = nodes[i];
      if (path.indexOf(nextNodeIndex) < 0) {
        pathLen++;
        path.push(nextNodeIndex);
        if (pathLen === n || parse(edges[nextNodeIndex]))
          return true;
        pathLen--;
        path.pop(nextNodeIndex);
      }
    }
  }
}


var start = Date.now();

var n = 45;
createGraphEdges(n);
// edges.forEach(function(squares, inx) {
//   console.log(inx + ': [' + squares.joinedColumnIdPairs(',') + ']');
// });
var graphCreatedTime = Date.now();


var hamiltonPath = getHamiltonPath();
console.log(n + ':' + hamiltonPath.join(','));

var hamiltonPathTime = Date.now();

console.log((graphCreatedTime - start) + ':' + (hamiltonPathTime - graphCreatedTime));


