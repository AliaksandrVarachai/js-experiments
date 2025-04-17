function nicePara(inText, lineLength) {
  const paragraphs = [];
  let restText = inText.trim();
  let pos;

  function updateRestTextByPos(postfix) {
    debugger;
    let paragraph = restText.slice(0, pos) + (postfix || '');
    paragraphs.push(paragraph);
    restText = restText.slice(pos).trimLeft();
  }

  while (restText) {
    debugger;
    if (restText.length <= lineLength) {
      paragraphs.push(restText);
      restText = '';
      continue;
    }
    //pos = lineLength - 2; // the 1st char index after \n
    pos = lineLength; // \n is not icluded in the length
    if (restText[pos] === ' ') {
      // end of word
      updateRestTextByPos();
      continue;
    }
    if (restText[pos - 1] === ' ') {
      // start of next word
      pos -= 1;
      updateRestTextByPos();
      continue;
    }

    // check if the word can be broken
    let wordLeftInx = pos;
    while (/[^\s-]/.test(restText[wordLeftInx])) --wordLeftInx;
    if (restText[wordLeftInx - 1] === '-') {
      // break by -
      pos = wordLeftInx;
      updateRestTextByPos();
      continue;
    }
    // whitespace found: checking if the word can be broken
    pos -= 1; // for -
    const wordLeftHalf = restText.slice(wordLeftInx, pos);
    let wordRightInx = pos;
    while (/[^\s-]/.test(restText[wordRightInx])) ++wordRightInx;
    const wordRightHalf = restText.slice(pos, wordRightInx);
    if (/[\w]{2}/i.test(wordLeftHalf) && /[\w]{2}/i.test(wordRightHalf)) {
      // word can be broken at pos
      updateRestTextByPos('-');
      continue;
    }
    // word cannot be broken at pos
    pos = wordLeftInx - 1; // for ' '
    updateRestTextByPos();
  }
  console.log(paragraphs);
  return paragraphs.join('\n');
}

module.exports = nicePara;