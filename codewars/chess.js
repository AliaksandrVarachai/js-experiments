const assert = require('assert');

// we need state to avoid recalculation of positions
function Board(pieces, player) {
  this.pieces = pieces.map(piece => ({ ...piece }));
  this.occupiedSquares; // getter;
  this.attackedSquares;   // getter;
  this.attackingSquares;  // getter;

  // updates this.occupiedPositions;
  this.updateOccupiedPositions = function() {
    this.occupiedSquares = [];
    for (let i = 0; i < 8; ++i)
      this.occupiedSquares.push([-1, -1, -1, -1,   -1, -1, -1, -1]);
    this.pieces.forEach((piece, inx) => this.occupiedSquares[piece.x][piece.y] = inx);
  };


  // updates this.attackedSquares & this.attackingSquares
  this.updateAttacks = function() {
    this.attackedSquares = [];
    this.attackingSquares = [];
    for (let i = 0; i < 8; ++i) {
      this.attackedSquares.push([[],[], [],[], [],[], [],[]]);
      this.attackingSquares.push([[],[], [],[], [],[], [],[]]);
    }

    this.pieces.forEach(({ piece, owner, x, y }, inx) => {
      // returns true if a square is free, false otherwise
      const addAttackIfPossible = (i, j) => {
        if (i < 0 || i > 7 || j < 0 || j > 7)
          return false;
        if (owner === player) {
          this.attackingSquares[i][j].push(inx);
        } else {
          this.attackedSquares[i][j].push(inx);
        }
        return this.occupiedSquares[i][j] < 0;
      };

      const rookAttacks = () => {
        for (let i = x - 1; ; --i)
          if (!addAttackIfPossible(i, y))
            break;
        for (let i = x + 1; ; ++i)
          if (!addAttackIfPossible(i, y))
            break;
        for (let j = y - 1; ; --j)
          if (!addAttackIfPossible(x, j))
            break;
        for (let j = y + 1; ; ++j)
          if (!addAttackIfPossible(x, j))
            break;
      };

      const bishopAttacks = () => {
        for (let i = x - 1, j = y - 1; ; --i, --j)
          if (!addAttackIfPossible(i, j))
            break;
        for (let i = x - 1, j = y + 1; ; --i, ++j)
          if (!addAttackIfPossible(i, j))
            break;
        for (let i = x + 1, j = y - 1; ; ++i, --j)
          if (!addAttackIfPossible(i, j))
            break;
        for (let i = x + 1, j = y + 1; ; ++i, ++j)
          if (!addAttackIfPossible(i, j))
            break;
      };

      switch (piece) {
        case 'pawn':
          if (owner === 0) {
            addAttackIfPossible(x + 1, y - 1);
            addAttackIfPossible(x - 1, y - 1);
          } else {
            addAttackIfPossible(x + 1, y + 1);
            addAttackIfPossible(x - 1, y + 1);
          }
          break;
        case 'rook':
          rookAttacks();
          break;
        case 'knight':
          addAttackIfPossible(x - 2, y - 1);
          addAttackIfPossible(x - 2, y + 1);
          addAttackIfPossible(x + 2, y - 1);
          addAttackIfPossible(x + 2, y + 1);
          addAttackIfPossible(x - 1, y - 2);
          addAttackIfPossible(x - 1, y + 2);
          addAttackIfPossible(x + 1, y - 2);
          addAttackIfPossible(x + 1, y + 2);
          break;
        case 'bishop':
          bishopAttacks();
          break;
        case 'queen':
          rookAttacks();
          bishopAttacks();
          break;
        case 'king':
          addAttackIfPossible(x - 1, y - 1);
          addAttackIfPossible(x - 1, y    );
          addAttackIfPossible(x - 1, y + 1);
          addAttackIfPossible(x    , y - 1);
          addAttackIfPossible(x    , y + 1);
          addAttackIfPossible(x + 1, y - 1);
          addAttackIfPossible(x + 1, y    );
          addAttackIfPossible(x + 1, y + 1);
          break;
        default:
          throw Error(`Wrong piece name "${piece}"`);
      }
    });
  };

  // init/update block
  this.updateAll = function() {
    this.prevOccupiedSquares = this.occupiedSquares;
    this.prevAttackedSquares = this.attackedSquares;
    this.prevAattackingSquares = this.attackingSquares;

    this.updateOccupiedPositions();
    this.updateAttacks();
    let inx = 0;
    while ('king' !== this.pieces[inx].piece || player !== this.pieces[inx].owner) ++inx;
    this.kingPosition = {x: this.pieces[inx].x, y: this.pieces[inx].y};
  };

  this.updateAll();

  this.setKingPosition = function(x, y) {
    this.kingPosition.x = x;
    this.kingPosition.y = y;
  };

  // Returns an array of threats if the arrangement of
  // the pieces is a check, otherwise false
  this.isCheck = function() {
    const { x, y } = this.kingPosition;
    return this.attackedSquares[x][y].length ? this.attackedSquares[x][y].map(inx => this.pieces[inx]) : false;
  };

  // Returns true if the arrangement of the
  // pieces is a check mate, otherwise false
  this.isMate = function() {
    if (!this.isCheck()) return false;

    // King moves or beats a next piece
    const isPossibleKingMove = (i, j) => {
      if ( i < -1 || i > 7 || j < -1 || j > 7) return false;
      const pieceInx = this.occupiedSquares[i][j];
      return this.attackedSquares[i][j].length === 0 && (pieceInx < 0 || this.pieces[pieceInx].owner !== player);
    };

    const { x, y } = this.kingPosition;

    if (
      isPossibleKingMove(x - 1, y - 1) ||
      isPossibleKingMove(x - 1, y    ) ||
      isPossibleKingMove(x - 1, y + 1) ||
      isPossibleKingMove(x    , y - 1) ||
      isPossibleKingMove(x    , y + 1) ||
      isPossibleKingMove(x + 1, y - 1) ||
      isPossibleKingMove(x + 1, y    ) ||
      isPossibleKingMove(x + 1, y + 1)
    ) return false;

    // Player's piece beats a checker
    const checkingPieces = this.attackedSquares[x][y];

    if (checkingPieces.length > 1)
      return true; // double check

    const checkerInx = checkingPieces[0];

    const { x: checkerX, y: checkerY } = this.pieces[checkerInx];
    for (let defenderInx of this.attackingSquares[checkerX][checkerY]) {
      this.movePiece(defenderInx, { x: checkerX, y: checkerY });
      if (!this.isCheck()) {
        this.revertMovePiece();
        return false;
      }
      this.revertMovePiece();
    }

    // Player's piece hides a king
    if (this.pieces[checkerInx].piece === 'knight' || this.pieces[checkerInx].piece === 'pawn')
      return true;

    const targetSquares = [];
    this.attackedSquares.forEach((row, y) => row.forEach((attackerInx, x) => {
      if (attackerInx === checkerInx)
        targetSquares.push({ x, y });
    }));
    for (let { x: targetX, y: targetY } of targetSquares) {
      if (this.attackingSquares[targetX][targetY].length < 1)
        break;
      for (let defenderInx of this.attackingSquares[targetX][targetY]) {
        this.movePiece(defenderInx, {x: targetX, y: targetY});
        if (!this.isCheck()) {
          this.revertMovePiece();
          return false;
        }
        this.revertMovePiece();
      }
    }

    return true;
  };


  // x, y must be valid for the piece
  this.movePiece = function(pieceInx, {x, y}) {
    this.prevPieces = this.pieces;
    // beats opponent's piece if possible
    this.pieces = this.pieces.filter(({x: targetX, y: targetY, owner}) =>
      x !== targetX || y !== targetY || owner === player
    );
    this.pieces[pieceInx].x = x;
    this.pieces[pieceInx].y = y;
  };

  this.revertMovePiece = function() {
    this.pieces = this.prevPieces;
    this.occupiedSquares = this.prevOccupiedSquares;
    this.attackedSquares = this.prevAttackedSquares;
    this.attackingSquares = this.prevAattackingSquares;
  }
}



// Returns an array of threats if the arrangement of
// the pieces is a check, otherwise false
function isCheck(pieces, player) {
  const board = new Board(pieces, player);
  return board.isCheck();
}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player) {
  const board = new Board(pieces, player);
  return board.isMate();
}


var pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "pawn", owner: 1, x: 5, y: 6}
];

assert.deepStrictEqual(isCheck(pieces, 0), [pieces[2]], "Pawn threatens king");

pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "rook", owner: 1, x: 4, y: 1}
];
assert.deepStrictEqual(isCheck(pieces, 0), [pieces[2]], "Rook threatens king");

pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "knight", owner: 1, x: 2, y: 6}
];
assert.deepStrictEqual(isCheck(pieces, 0), [pieces[2]], "Knight threatens king");

pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "bishop", owner: 1, x: 0, y: 3}
];
assert.deepStrictEqual(isCheck(pieces, 0), [pieces[2]], "Bishop threatens king");

pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "queen", owner: 1, x: 4, y: 1}
];
assert.deepStrictEqual(isCheck(pieces, 0), [pieces[2]], "Queen threatens king");

pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "queen", owner: 1, x: 7, y: 4}
];
assert.deepStrictEqual(isCheck(pieces, 0), [pieces[2]], "Queen threatens king");

pieces = [
  {piece: "king", owner: 1, x: 4, y: 0},
  {piece: "pawn", owner: 0, x: 4, y: 6},
  {piece: "pawn", owner: 0, x: 5, y: 6},
  {piece: "king", owner: 0, x: 4, y: 7},
  {piece: "bishop", owner: 0, x: 5, y: 7},
  {piece: "bishop", owner: 1, x: 1, y: 4},
  {piece: "rook", owner: 1, x: 2, y: 7, prevX: 2, prevY: 5}
];
sortFunc = function(a, b) {
  if(a.y == b.y) return a.x - b.x;
  return a.y - b.y;
};
assert.deepStrictEqual(isCheck(pieces, 0).sort(sortFunc), [pieces[5], pieces[6]], "Double threat");

// ********************************

pieces = [ { piece: 'pawn', owner: 0, x: 6, y: 4 },
  { piece: 'pawn', owner: 0, x: 5, y: 5 },
  { piece: 'pawn', owner: 0, x: 3, y: 6 },
  { piece: 'pawn', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 7, y: 6 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'knight', owner: 0, x: 6, y: 7 },
  { piece: 'rook', owner: 0, x: 7, y: 7 },
  { piece: 'queen', owner: 1, x: 7, y: 4, prevX: 3, prevY: 0 },
  { piece: 'king', owner: 1, x: 4, y: 0 } ];
assert.strictEqual(isMate(pieces, 0), false, '??? #1');


pieces = [ { piece: 'pawn', owner: 0, x: 6, y: 4 },
  { piece: 'pawn', owner: 0, x: 5, y: 5 },
  { piece: 'pawn', owner: 0, x: 3, y: 6 },
  { piece: 'pawn', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 7, y: 6 },
  { piece: 'queen', owner: 0, x: 3, y: 7 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'knight', owner: 0, x: 6, y: 7 },
  { piece: 'rook', owner: 0, x: 7, y: 7 },
  { piece: 'queen', owner: 1, x: 7, y: 4, prevX: 3, prevY: 0 },
  { piece: 'king', owner: 1, x: 4, y: 0 } ];
assert.strictEqual(isMate(pieces, 0), true, '??? #2');