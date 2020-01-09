function execute(code) {
  if (!code)
    return '*';

  const path = [];
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  let dirInx = 0;
  let i = 0, j = 0;
  path.push([0, 0]);

  let lexems = [];
  for (let i = 0, len = code.length; i < len; ++i) {
    const start = i;
    while (!isNaN(+code[i]))
      ++i;
    if (start < i) {
      lexems.push(+code.substring(start, i));
      --i;
    } else {
      lexems.push(code[i]);
      if (code[i] === ')' && isNaN(+code[i + 1]))
        lexems.push(1);
    }
  }
  console.log(lexems.join(''));

  function _addPos() {
    switch (lexems[pos]) {
      case 'L':
        dirInx = (dirInx + 1) % 4;
        break;
      case 'R':
        dirInx = (dirInx + 3) % 4;
        break;
      case 'F':
        i += dirs[dirInx][0];
        j += dirs[dirInx][1];
        path.push([i, j]);
        break;
    }
  }

  let pos = 0;

  function addPosToPath(isFirst = true) {
    if (pos >= lexems.length)
      return;

    const start = pos;
    if (typeof lexems[pos] === 'number') {
      const num = lexems[pos--];
      for (let k = 1; k < num; ++k)
        _addPos();
      pos += 2;
    } else if (lexems[pos] === '(') {
      ++pos;
      //addPosToPath();
    } else if (lexems[pos] === ')') {
      if (isFirst) {
        const num = lexems[pos + 1];
        for (let k = 1; k < num; ++k) {
          pos = start;
          addPosToPath(false);
        }
      }
      pos += 2;
    } else {
      _addPos();
      ++pos;
    }

    addPosToPath();
  }

  addPosToPath();

  // finds the max sizes of robot's route on the grid
  let maxCol = path[0][0], minCol = path[0][0];
  let maxRow = path[0][1], minRow = path[0][1];
  path.forEach(([col, row]) => {
    if (col > maxCol) {
      maxCol = col;
    } else if (col < minCol) {
      minCol = col;
    }
    if (row > maxRow) {
      maxRow = row;
    } else if (row < minRow) {
      minRow = row;
    }
  });

  const grid = [];
  for (let row = minRow; row <= maxRow; ++row) {
    const line = [];
    grid.push(line);
    for (let col = minCol; col <= maxCol; ++col)
      line.push(' ');
  }
  path.forEach(([col, row]) => grid[row - minRow][col - minCol] = '*');

  return grid.reduceRight((acc, line, inx) => acc + line.join('') + (inx ? '\r\n' : ''), '');
}

let result = execute("F4L(F4RF4RF4LF4L)2F4RF4RF4");
console.log(result);
'    *****   *****   *****\r\n    *   *   *   *   *   *\r\n    *   *   *   *   *   *\r\n    *   *   *   *   *   *\r\n*****   *****   *****   *'
'    *****   *****\r\n    *   *   *   *\r\n    *   *   *   *\r\n    *   *   *   *\r\n*****   *****   *'

'    *****   *****   *****'
'    *   *   *   *   *   *'
'    *   *   *   *   *   *'
'    *   *   *   *   *   *'
'*****   *****   *****   *'