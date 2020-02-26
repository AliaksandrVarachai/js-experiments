function getOccupiedPlayerPositions(pieces, player) {
  const occupiedPlayerPositions = [];
  for (let i = 0; i < 8; ++i)
    occupiedPlayerPositions.push([false,false, false,false, false,false, false,false]);
  pieces.forEach(piece => {
    if (piece.owner !== player)
      return;
    occupiedPlayerPositions[piece.x][piece.y] = true;
  });
  return occupiedPlayerPositions;
}

function getOccupiedPositions(pieces) {
  const occupiedPositions = [];
  for (let i = 0; i < 8; ++i)
    occupiedPositions.push([false,false, false,false, false,false, false,false]);
  pieces.forEach(piece => {
    occupiedPositions[piece.x][piece.y] = true;
  });
  return occupiedPositions;
}

function getAttackedPieces(pieces, player) {
  const occupiedPositions = getOccupiedPositions(pieces);

  const attackedPieces = [];
  for (let i = 0; i < 8; ++i)
    attackedPieces.push([[],[], [],[], [],[], [],[]]);
  const attackingPieces = pieces.map(_ => []);

  pieces.forEach(({ piece, owner, x, y }, inx) => {
    if (owner === player)
      return;

    const addAttackIfPossible = (i, j) => {
      if (i < 0 || i > 7 || j < 0 || j > 7)
        return false;
      attackedPieces[i][j].push(inx);
      attackingPieces[inx].push({x: i, y: j});
      return !occupiedPositions[i][j];
    }

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
    }

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
    }

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

  return { attackedPieces, attackingPieces };
}

function getKingPosition(pieces, player) {
  let inx = 0;
  while ('king' !== pieces[inx].piece || player !== pieces[inx].owner)
    ++inx;
  return {x: pieces[inx].x, y: pieces[inx].y};
}


// Returns an array of threats if the arrangement of
// the pieces is a check, otherwise false
function isCheck(pieces, player) {
  const { attackedPieces } = getAttackedPieces(pieces, player);
  const { x, y } = getKingPosition(pieces, player);
  return attackedPieces[x][y].length ? attackedPieces[x][y].map(inx => pieces[inx]) : false;
}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player) {
  const { attackedPieces, attackingPieaces } = getAttackedPieces(pieces, player);
  const occupiedPlayerPositions = getOccupiedPlayerPositions(pieces, player);
  const { x, y } = getKingPosition(pieces, player);

  const isForbiddenMove = (i, j) => {
    if ( i < -1 || i > 7 || j < -1 || j > 7)
      return true;
    return attackedPieces[i][j].length || occupiedPlayerPositions[i][j];
  }

  // TODO: complete
//   let isBeatenChecker = false;
//   for (let inx = 0; inx < pieces.length; ++inx) {
//   }

//   let isHiddenChecker = false;
//   let isEscapedChecker = false;

  const res = attackedPieces[x][y].length &&
    isForbiddenMove(x - 1, y - 1) &&
    isForbiddenMove(x - 1, y    ) &&
    isForbiddenMove(x - 1, y + 1) &&
    isForbiddenMove(x    , y - 1) &&
    isForbiddenMove(x    , y + 1) &&
    isForbiddenMove(x + 1, y - 1) &&
    isForbiddenMove(x + 1, y    ) &&
    isForbiddenMove(x + 1, y + 1);


  console.log(res)
  return res;
}

