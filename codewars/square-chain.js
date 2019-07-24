function FastArray(maxLength = 1024) {
  if (maxLength > 1024)
    throw Error('Array must have max length 1024.');
  this.array = new Int32Array(maxLength);                         // contains numbers
  this.arrayBits = new Int32Array(Math.ceil(maxLength / 32));  // for fast search
  this.arrayTop = -1;                                             // last array index
}

FastArray.prototype.push = function(number) {
  this.arrayTop++;
  this.array[this.arrayTop] = number;
  var bit = 1 << (number << 27 >>> 27);
  this.arrayBits[number >>> 5] |= bit;
};

FastArray.prototype.pop = function() {
  var number = this.array[this.arrayTop];
  this.array[this.arrayTop] = 0;
  var bit = 1 << (number << 27 >>> 27);
  this.arrayBits &= ~bit;
  this.arrayTop--;
  return number;
};

FastArray.prototype.contains = function(number) {
  var mask = 1 << (number << 27 >>> 27);
  return this.arrayBits[number >>> 5] & mask;
};

FastArray.prototype.get = function(index) {
  return this.array[index];
};

FastArray.prototype.erase  = function() {
  this.array.fill(0);
  this.arrayBits.fill(0);
  this.arrayTop = -1;
};

FastArray.prototype.toString = function() {
  var s = '';
  for (var i = 0; i <= this.arrayTop; i++) {
    s += this.array[i] + ',';
  }
  return s.slice(0, s.length - 1);
};

Object.defineProperties(FastArray.prototype, {
  length: {
    get() { return this.arrayTop + 1; }
  },
  last: {
    get() {return this.array[this.arrayTop]; }
  }
});

var n = 30;

var maxSquare = Math.floor(Math.sqrt(2 * n - 1));
var squares = new Int32Array(maxSquare - 1);
for (var i = 2; i <= maxSquare; i++) {
  squares[i - 2] = i * i;
}
var squaresIndexes = {};
squares.forEach((square, index) => {
  squaresIndexes[square] = index;
});


var chain = new FastArray(n);

function createMaxChain(startNumber) {
  function extendChain(number) {
    chain.push(number);
    var i = maxSquare - 2;
    var pairNumber = squares[i] - number;
    while (pairNumber > n) {
      i--;
      pairNumber = squares[i] - number;
    }
    while (pairNumber > 0 && chain.contains(pairNumber) && i > 0) {
      i--;
      pairNumber = squares[i] - number;
    }
    if (pairNumber > 0 && i > 0) {
      extendChain(pairNumber);
    }
  }

  extendChain(startNumber);
}

// build first approximation
createMaxChain(n);


var rest = new FastArray(n);

var edges = new Int32Array(n * squares.length);
var edgesTops = new Int32Array(n).fill(-1);
edges.toString = function() {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += i + ':';
    for (var j = 0; j < squares.length; j++) {
      s += getEdgeValue(i, j) + ',';
    }
    s = s.slice(0, s.length - 1) + '\n';
  }
  return s;
};


function addEdge(fromNumber, toNumber) {
  var fromIndex = fromNumber - 1;
  edgesTops[fromIndex]++;
  edges[fromIndex * squares.length + edgesTops[fromIndex]] = toNumber;
}

function getEdgeValue(fromIndex, toIndex) {
  return edges[fromIndex * squares.length + toIndex];
}

// Forms a graph from elements that chain does not contain
function fillRestEdges() {
  // TODO: use symmetry of edge to improve performance
  for (var i = 0; i < n; i++) {
    var fromNumber = i + 1;
    for (var j = 0; j < squares.length; j++) {
      var toNumber = squares[j] - fromNumber;
      if (toNumber > n)
        break;
      if (toNumber < 1 || toNumber === fromNumber || chain.contains(fromNumber))
        continue;
      if (!rest.contains(fromNumber)) {
        rest.push(fromNumber);
      }
      addEdge(fromNumber, toNumber);
    }
  }
}

fillRestEdges();
console.log(edges.toString())


// Updates edges basing ont its previous state
function moveLastFromChainToRest() {
  var movedNumber = chain.pop();
  var i, j;

  // Adds movedNumber to all rest elements in edge
  for (i = 0; i < rest.length; i++) {
    var restNumber = rest.get(i);
    if (squaresIndexes[restNumber + movedNumber] !== undefined) {
      addEdge(restNumber, movedNumber);
    }
  }

  rest.push(movedNumber);

  // Adds movedNumber row to edge
  for (j = 0; j < squares.length; j++) {
    var toNumber = j + 1;
    if (squares[j] <= toNumber || squares[j] === toNumber << 1)
      continue;
    if (squares[j] >= toNumber + n)
      break;
    if (rest.contains(toNumber)) {
      addEdge(movedNumber, toNumber);
    }
  }
}

// Now there are next objects:
// 1. chain
// 2. rest
// 3. edges / edgesTops


// Checks the necessary criterion for Hamiltonian. Returns false if there are isolated vertices or more than two vertices
// with one degree (one of them must be equal to startVertex), otherwise returns true.
function checkVertexDegrees(startVertex) {
  var vertexDegrees = new Int32Array(rest.length);
  var i;
  for (i = rest.length - 1; i > -1; i--) {
    var fromNumber = rest.get(i);
    for (var j = edgesTops[fromNumber]; j > -1; j--) {
      var toNumber = getEdgeValue(i, j);
      vertexDegrees[toNumber - 1]++;
    }
  }

  var oneDegreeVertices = [];
  for (i = vertexDegrees.length - 1; i > -1; i--) {
    if (vertexDegrees[i] === 0)
      return false;  // there is an isolated vertex
    if (vertexDegrees[i] === 1) {
      if (vertexDegrees.length > 1)
        return false;  // more than 2 vertices with 1 degree
      oneDegreeVertices.push(i);
    }
  }

  if (oneDegreeVertices.length > 0)
    return oneDegreeVertices.indexOf(startVertex) > -1; // 2 or less vertices with 1 degree;

  return true;
}



// chain, rest, edges, edgesTops are ready
function getRestPath() {
  var MAX_REST_LENGTH = 40;
  var path = new FastArray(MAX_REST_LENGTH); // I hope there is always a hamiltonian for 32 elements!!!

  function findHamiltonian(restIndex) {
    if (path.length === rest.length)
      return true;
    if (path.contains(rest.get(restIndex)))
      return false;
    path.push(rest.get(restIndex));
    for (var i = 0; i <= edgesTops[restIndex]; i++) {
      if (findHamiltonian(i)) {
        return true;
      }
    }
    path.pop();
  }

  while(rest.length <= MAX_REST_LENGTH) {
    debugger;
    path.erase();
    if (checkVertexDegrees(chain.last)) {
      // try to find a hamiltonian in rest
      findHamiltonian(chain.last);
      if (path.length === rest.length)
        return path;
      moveLastFromChainToRest();
    }
    moveLastFromChainToRest();
  }

  if (rest.length > MAX_REST_LENGTH) {
    return 'SUCKS!'; // TODO: remove
  }

  return false;
}

var restPath = getRestPath();
console.log('chain: ' + chain);
console.log('rest path: ' + restPath);

console.log(`hamiltonian: ${chain},${restPath}`);

