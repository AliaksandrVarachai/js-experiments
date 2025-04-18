function wrap_cube(shape) {
//If a net can't be wrapped onto a cube, return null.
  // If it can, return a list of overlapping squares.
  // For example the output of Example 1 in the description is `[['A', 'E']].`
  // The output of the Example 2 could be ``[["A", "F"], ["E", "G"]]``
  const arr = shape.split('\n'); // only for reading
  const wrappedFaces = { // faces that cover specific directions, e.g. +x => 'X', -x => 'x'
    'X': [], 'x': [],
    'Y': [], 'y': [],
    'Z': [], 'z': [],
  };
  const processedFaces = {}; // { "1-2": X, "2-2": Y,... }

  // seed the calculation
  const startFaces = getTwoStartFaces(arr);
  if (!startFaces) return [];
  const [[i1, j1], [i2, j2]] = startFaces;
  wrappedFaces.X.push(arr[i1][j1]);
  wrappedFaces.Z.push(arr[i2][j2]);
  debugger;
  processedFaces[`${i1}-${j1}`] = 'X';
  processedFaces[`${i2}-${j2}`] = 'Z';

  if (!processFace([i1, j1, 'X'], [i2, j2, 'Z'])) return null;
  if (!processFace([i2, j2, 'Z'], [i1, j1, 'X'])) return null;

  return Object.values(wrappedFaces).filter(arr => arr.length > 1);

  function getTwoStartFaces(arr) {
    for(let i = 0; i < arr.length; ++i) {
      for (let j = 0; j < arr[i].length; ++j) {
        if (arr[i][j] !== ' ') {
          for (let [ii, jj] of [[i, j + 1], [i + 1, j]]) {
            if (arr[ii] && arr[ii][jj] && arr[ii][jj] !== ' ') return [[i, j], [ii, jj]];
          }
        }
      }
    }
  }

  // sin = 0,-1,+1
  // returns a char from 'xyzXYZ' depending on sin of rotation angle;
  function getNextFace(face, prevFace, sin) {
    const nextFaceInxShift = sin === 1 ? 1 : (sin === 0 ? 2 : 3);
    const cutOutShapes = {
      X: 'ZyzYZyzY',
      x: 'yZYzyZYz',
      Y: 'ZXzxZXzx',
      y: 'ZxzXZxzX',
      Z: 'XYxyXYxy',
      z: 'XyxYXyxY'
    };
    const prevFaceInx = cutOutShapes[face].indexOf(prevFace);
    return cutOutShapes[face][prevFaceInx + nextFaceInxShift];
  }

  // calculate XxYxXz for the face & add it to the map
  // returns false if a contradiction found, true otherwise
  function processFace(face, prevFace) {
    const [fi, fj, fValue] = face;
    const [pi, pj, pValue] = prevFace;
    for (let [i, j] of [[fi - 1, fj], [fi + 1, fj], [fi, fj - 1], [fi, fj + 1]]) {
      if (i === pi && j === pj || !arr[i] || !arr[i][j]) continue;
      if (arr[i][j] !== ' ') {
        const faceKey = `${i}-${j}`;
        const sin = (pi - fi) * (j - fj) - (i - fi) * (pj - fj); // 0; -1; +1
        const value = getNextFace(fValue, pValue, sin);
        // TODO: is it possible to have a closed cycle?
        if (processedFaces[faceKey] && processedFaces[faceKey] !== value) return false;
        processedFaces[faceKey] = value;
        wrappedFaces[value].push(arr[i][j]);
        if (!processFace([i, j, value], [fi, fj, fValue])) return false;
      }
    }
    return true;
  }
}

module.exports = wrap_cube;
