var n = 60;
var chain = new Int32Array(n).fill(0);
var chainBits = new Int32Array(32).fill(0); // 32*32=1024
var chainTop;

// TODO: calculate free elements, check hamilton path. When negative - decrease chain and repeat
var freeElements = new Int32Array(n).fill(0); // TODO: Provide the same functionality like for chain - inheritance


var maxSquare = Math.floor(Math.sqrt(2 * n - 1));
var squares = new Int32Array(maxSquare - 1);
for (var i = 2; i <= maxSquare; i++) {
  squares[i - 2] = i * i;
}
console.log(squares.join(','));

function createMaxChain() {
  function extendChain(number) {
    chainPush(number);
    var i = maxSquare - 2;
    var pairNumber = squares[i] - number;
    while (pairNumber > 0 && chainContains(pairNumber) && i > 0) {
      i--;
      pairNumber = squares[i] - number;
    }
    if (pairNumber > 0 && i > 0) {
      extendChain(pairNumber);
    }
  }

  extendChain(n);
}

function chainPush(number) {
  chainTop++;
  chain[chainTop] = number;
  var bit = 1 << (number << 27 >>> 27);
  chainBits[number >>> 5] |= bit;
}

function chainPop() {
  var number = chain[chainTop];
  chain[chainTop] = 0;
  var bit = 1 << (number << 27 >>> 27);
  chainBits &= ~bit;
  chainTop--;
  return number;
}

function chainContains(number) {
  var mask = 1 << (number << 27 >>> 27);
  return chainBits[number >>> 5] & mask;
}


