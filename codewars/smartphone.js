var vertexIndexes = {
  A: 0, B: 1, C: 2,
  D: 3, E: 4, F: 5,
  G: 6, H: 7, I: 8
};

var vertexGraph = [
  [1,3,4,5,7],
  [0,2,3,4,5,6,8],
  [1,3,4,5,7],
  [0,1,2,4,6,7,8],
  [0,1,2,3,5,6,7,8],
  [0,1,2,4,6,7,8],
  [1,3,4,5,7],
  [0,2,3,4,5,6,8],
  [1,3,4,5,7],
];


var adjacentEdges;
var edgeGraph;

generateEdgeGraph(vertexGraph);

// Fills adjacentEdges and edgeGraph;
function generateEdgeGraph(vertexGraph) {
  var edgeInx = -1;
  var i, j;
  adjacentEdges = [];
  for (i = vertexGraph.length - 1; i > -1; i--)
    adjacentEdges.push([]);

  for (i = 0, iLen = vertexGraph.length; i < iLen; i++) {
    for (j = 0, jLen = vertexGraph[i].length; j < jLen; j++) {
      var toVertex = vertexGraph[i][j];
      if (toVertex < i)
        continue;
      edgeInx++;
      adjacentEdges[i].push(edgeInx);
      adjacentEdges[toVertex].push(edgeInx);
    }
  }

  edgeGraph = [];
  for (i = 0; i <= edgeInx; i++)
    edgeGraph.push([]);

  for (var fromVertex = 0; fromVertex < adjacentEdges.length; fromVertex++) {
    for (i = 0, len = adjacentEdges[fromVertex].length; i < len; i++) {
      var edge = adjacentEdges[fromVertex][i];
      for (var k = 0; k < len; k++) {
        if (k === i)
          continue;
        var nextEdge = adjacentEdges[fromVertex][k];
        if (edgeGraph[edge].indexOf(nextEdge) === -1)
          edgeGraph[edge].push(nextEdge);
      }
    }
  }
  for (i = 0; i <= edgeInx; i++)
    edgeGraph[i].sort((a, b) => a - b);
}


/* String, Int ->  Int */
function countPatternsFrom(firstDot, length) {
  if (length < 1)
    return 0;
  if (length < 2)
    return 1;

  var counter = 0;
  // var firstInx = vertexIndexes[firstDot];
  var path = [];

  var firstVertex = vertexIndexes[firstDot];
  for (var i = 0; i < adjacentEdges[firstVertex].length; i++) {
    // debugger;
    var edge = adjacentEdges[firstVertex][i];
    path.push(edge);
    for (var j = 0; j < edgeGraph[edge].length; j++) {
      var nextEdge = edgeGraph[edge][j];
      if (adjacentEdges[firstVertex].indexOf(nextEdge) > -1)
        continue;
      path.push(edge);
      count(edge, length - 2);
      path.pop(edge);
    }
    path.pop(edge);
  }

  function count(edge, len) {
    if (len === 0) {
      counter++;
      return;
    }
    // debugger;

    for (var i = 0, edgeNumber = edgeGraph[edge].length; i < edgeNumber; i++) {
      var nextEdge = edgeGraph[edge][i];
      if (path.indexOf(nextEdge) === -1) {
        path.push(nextEdge);
        count(nextEdge, len - 1);
        path.pop(nextEdge);
      }
    }
  }

  // (function count(inx, prevInx, len) {
  //   if (len === 1) {
  //     counter += edges[inx].length - 1;
  //     return;
  //   }
  //
  //   for(var i = edges[inx].length - 1; i > -1; i--) {
  //     if (i !== prevInx)
  //       count(edges[inx][i], inx, len - 1);
  //   }
  // })(firstInx, -1, length);

  return counter;
}

console.log(countPatternsFrom('C', 2));