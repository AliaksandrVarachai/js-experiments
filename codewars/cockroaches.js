var holes = {};
for (var i = 0; i < 10; ++i)
  holes[i] = i;

var directions = {
  U: 'U', D: 'D', L: 'L', R: 'R'
}

function getHole(i, j, dir, room) {
  var w = room[0].length;
  var h = room.length;
  while (true) {
    if (i === 0) {
      if (j === 0) {
        if (dir === 'U') dir = 'R';
        else if (dir === 'L') dir = 'D';
      } else if (j === w - 1) {
        if (dir === 'U') dir = 'L';
        else if (dir === 'R') dir = 'D'
      } else {
        if (dir === 'U') dir = 'L';
      }
    } else if (i === h - 1) {
      if (j === 0) {
        if (dir === 'D') dir = 'R';
        else if (dir === 'L') dir = 'U';
      } else if (j === w - 1) {
        if (dir === 'D') dir = 'L';
        else if (dir === 'R') dir = 'U';
      } else {
        if (dir === 'D') dir = 'R';
      }
    } else if (j === 0) {
      if (dir === 'L') dir = 'D';
    } else if (j === w - 1) {
      if (dir === 'R') dir = 'U';
    }
    switch (dir) {
      case 'U': --i; break;
      case 'D': ++i; break;
      case 'L': --j; break;
      case 'R': ++j; break;
      default: throw('Wrong direction');
    }
    if (holes[room[i][j]] !== undefined)
      return holes[room[i][j]];
  }
}

function cockroaches(room) {
  var cockroachEscapes = [0,0,0,0,0,0,0,0,0,0];
  for (var i = room.length - 1; i > -1; --i)
    for (var j = room[0].length - 1; j > -1; --j)
      if (directions[room[i][j]] !== undefined)
        cockroachEscapes[getHole(i, j, directions[room[i][j]], room)] += 1;
  return cockroachEscapes;
}
