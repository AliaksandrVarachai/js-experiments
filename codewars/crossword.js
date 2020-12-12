function crossword2x2(p) {
  // words[] and values[str] = reserved
//   console.log(`words[0]    = ${words[0]}`);
//   console.log(`values['A'] = ${values['A']}`);
  console.log(p)

  let sharedIndexes; // [int, int] - shared indexes in the 1st and the 2nd word respecively
  let letter;        // { word: int?, inx: int?, value: string }
  if (p[0][0] === '#') {
    sharedIndexes = [1, 1];
    if (p[0][1] !== '_') {
      letter = { word: 0, inx: 0, value: p[0][1] };
    } else if (p[1][0] !== '_') {
      letter = { word: 1, inx: 0, value: p[1][0] };
    } else {
      letter = { value: p[1][1]  };
    }
  } else if (p[0][1] === '#') {
    sharedIndexes = [1, 0]
    if (p[0][0] !== '_') {
      letter = { word: 0, inx: 0, value: p[0][0] }
    } else if (p[1][1] !== '_') {
      letter = { word: 1, inx: 1, value: p[1][1] }
    } else {
      letter = { value: p[1][0]  };
    }
  } else if (p[1][0] === '#') {
    sharedIndexes = [1, 0];
    if (p[0][0] !== '_') {
      letter = { word: 0, inx: 0, value: p[0][0] }
    } else if (p[1][1] !== '_') {
      letter = { word: 1, inx: 1, value: p[1][1] }
    } else {
      letter = { value: p[0][1]  };
    }
  } else {
    sharedIndexes = [0, 0];
    if (p[0][1] !== '_') {
      letter = { word: 0, inx: 1, value: p[0][1] }
    } else if (p[1][0] !== '_') {
      letter = { word: 1, inx: 1, value: p[1][0] }
    } else {
      letter = { value: p[0][0]  };
    }
  }

  const result = [];
  if (letter.word === undefined) {
    const firstWords = words.filter(w => letter.value === w[sharedIndexes[0]]);
    const secondWords = words.filter(w => letter.value === w[sharedIndexes[1]]);
    firstWords.forEach(w1 => {
      secondWords.forEach(w2 => {
        if (w1 === w2) return;
        const value = values[w1[0]] + values[w1[1]] + values[w2[0]] + values[w2[1]];
        result.push([w1, w2, value]);
      });
    })
  } else {
    const wordCandidates = words.filter(w => letter.value === w[letter.inx]);
    if (letter.word > 0) {
      sharedIndexes = sharedIndexes.reverse();
    }
    console.log(wordCandidates)
    wordCandidates.forEach(w1 => {
      words.filter(w2 => w2[sharedIndexes[1]] === w1[sharedIndexes[0]]).forEach(w2 => {
        if (w1 === w2) return;
        const value = values[w1[0]] + values[w1[1]] + values[w2[0]] + values[w2[1]];
        if (letter.word === 0) result.push([w1, w2, value]);
        else result.push([w2, w1, value])
//         result.push([w1, w2, value])
      });
    });
  }
  result.sort((a, b) => {
    if (a[2] !== b[2]) return b[2] - a[2];
    if (a[0] !== b[0]) return a[0].localeCompare(b[0]);
    return a[1].localeCompare(b[1]);
  });

  return result;
}