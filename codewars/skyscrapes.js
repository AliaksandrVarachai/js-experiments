function generatePermutations(size = 6) {
  const permutations = [];
  const row = [];
  let i, j, k;

  for (i = 1; i <= size; ++i) row.push(i);

  permutations.push(row.slice());

  while (true) {
    i = size - 2;
    while (i > -1 && row[i] > row[i + 1]) --i;
    if (i === -1) return permutations;
    //i - эл-т нарушающий убывающую последовательность
    j = i + 1;
    while (j < size && row[j] > row[i]) ++j;
    // j - 1 - эл-т с которым меняем нарушающий эл-т
    [row[i], row[j - 1]] = [row[j - 1], row[i]];
    for (k = i + 1; k < size - 1 - k; ++k) {
      [row[k], row[size - 1 - k]] = [row[size - 1 - k], row[k]];
    }
    // начиная с i + 1 все элементы теперь упорядочены по возрастанию
    permutations.push(row.slice());
  }

  return permutations;
}

const permutations = generatePermutations(3);
permutations.forEach(perm => console.log(perm.join()));


function solvePuzzle(clues) {

}