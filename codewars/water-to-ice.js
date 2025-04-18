function compress(water){
  // returns true if not null shift, false otherwise & modifies molecule
  function shiftToLeft(lines, molecule) {
    const [i, j, type] = molecule;
    if (type === 'h') {
      let k = j - 1; // the most left empty pos
      while (k > 0 && lines[i][k - 1] === ' ') --k;
      if (k < j - 1) {
        [lines[i][j - 1], lines[i][j], lines[i][j + 1]] = [' ', ' ', ' '];
        [lines[i][k], lines[i][k + 1], lines[i][k + 2]] = ['H', 'O', 'H'];
        // console.log('shiftToLeft for ', molecule);
        // printLines(lines);
        molecule[1] = k + 1;
        return true;
      }
    } else {
      let k = j; // the most left empty pos
      while (k > 0 && lines[i - 1][k - 1] === ' ' && lines[i][k - 1] === ' ' && lines[i + 1][k - 1] === ' ') --k;
      if (k < j) {
        [lines[i - 1][j], lines[i][j], lines[i + 1][j]] = [' ', ' ', ' '];
        [lines[i - 1][k], lines[i][k], lines[i + 1][k]] = ['H', 'O', 'H'];
        // console.log('shiftToLeft for ', molecule);
        // printLines(lines);
        molecule[1] = k;
        return true;
      }
    }
    return false;
  }

  // returns true if not null shift, false otherwise & modifies molecule
  function shiftToTop(lines, molecule) {
    const [i, j, type] = molecule;
    if (type === 'h') {
      let k = i; // the most top empty pos
      while (k > 0 && lines[k - 1][j - 1] === ' ' && lines[k - 1][j] === ' ' && lines[k - 1][j + 1] === ' ') --k;
      if (k < i) {
        [lines[i][j - 1], lines[i][j], lines[i][j + 1]] = [' ', ' ', ' '];
        [lines[k][j - 1], lines[k][j], lines[k][j + 1]] = ['H', 'O', 'H'];
        // console.log('shiftToTop for ', molecule);
        // printLines(lines);
        molecule[0] = k;
        return true;
      }
    } else {
      let k = i - 1; // the most top empty pos
      while (k > 0 && lines[k - 1][j] === ' ') --k;
      if (k < i - 1) {
        [lines[i - 1][j], lines[i][j], lines[i + 1][j]] = [' ', ' ', ' '];
        [lines[k][j], lines[k + 1][j], lines[k + 2][j]] = ['H', 'O', 'H'];
        // console.log('shiftToTop for ', molecule);
        // printLines(lines);
        molecule[0] = k + 1;
        return true;
      }
    }
    return false;
  }

  // console.log('--------- water:')
  // console.log(water)
  const moleculesSet = new Set();
  const lines = water.split('\n').filter(line => !!line.trim()).map(line => line.split(''));
  const molecules = []; // [i, j, 'v|h'], where i,j are O's coords
  for (let i = 0; i < lines.length - 1; ++i) {
    for (let j = 0; j < lines[i].length; ++j) {
      if (lines[i][j] === '+' && lines[i + 1][j] === 'O' && !moleculesSet.has(`${i + 1}-${j}`)) {
        lines[i][j] = 'O';
        lines[i + 1][j] = ' ';
        molecules.push([i, j, 'h'])
        moleculesSet.add(`${i}-${j}`)
      } else if (lines[i][j] === 'O' && lines[i + 1][j] === '+' && !moleculesSet.has(`${i}-${j}`)) {
        lines[i][j] = ' ';
        lines[i + 1][j] = 'O';
        molecules.push([i + 1, j, 'h']);
        moleculesSet.add(`${i + 1}-${j}`)
      }
    }
  }

  for (let j = 0; j < lines[0].length - 1; ++j) {
    for (let i = 0; i < lines.length; ++i) {
      if (lines[i][j] === '+' && lines[i][j + 1] === 'O' && !moleculesSet.has(`${i}-${j + 1}`)) {
        lines[i][j] = 'O';
        lines[i][j + 1] = ' ';
        molecules.push([i, j, 'v']);
        moleculesSet.add(`${i}-${j}`)
      } else if (lines[i][j] === 'O' && lines[i][j + 1] === '+' && !moleculesSet.has(`${i}-${j}`)) {
        lines[i][j] = ' ';
        lines[i][j + 1] = 'O';
        molecules.push([i, j + 1, 'v']);
        moleculesSet.add(`${i}-${j + 1}`)
      }
    }
  }
  // console.log('-------lines:')
  // printLines(lines)

  let isShiftedToLeft, isShiftedToTop;
  do {
    isShiftedToLeft = false;
    isShiftedToTop = false;
    // sort molecules by columns
    molecules.sort(([i1, j1], [i2, j2]) => j1 - j2);
    for (let molecule of molecules) {
      if (shiftToLeft(lines, molecule)) isShiftedToLeft = true;
    }
    // sort molecules by rows
    molecules.sort(([i1], [i2]) => i1 - i2);
    for (let molecule of molecules) {
      if (shiftToTop(lines, molecule)) isShiftedToTop = true;
    }
  } while (isShiftedToLeft || isShiftedToTop);

  function printLines(lines) {
    console.log(lines.map(line => line.join('').trimRight()).join('\n'));
  }

  const result = lines.map(line => line.join('').trimRight()).join('\n').trim();
  // console.log('------ result:');
  // console.log(result)
  return result;
}

module.exports = compress;