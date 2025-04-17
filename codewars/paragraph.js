function nicePara(inText, lineLength) {
  const paragraphs = [];
  let restText = inText.trim();
  let pos;

  function updateRestTextByPos(postfix) {
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
    while (wordLeftInx > 0 && /[^\s-]/.test(restText[wordLeftInx - 1])) --wordLeftInx;
    const wordLeftHalf = restText.slice(wordLeftInx, pos - 1); // check if a work is broken not by hyphen
    if (restText[wordLeftInx - 1] === '-' && !/[\w]{2}/.test(wordLeftHalf)) {
      // break by -
      pos = wordLeftInx;
      updateRestTextByPos();
      continue;
    }
    // whitespace found: checking if the word can be broken
    pos -= 1; // for -

    while (pos > wordLeftInx) {
      const wordLeftHalf = restText.slice(wordLeftInx, pos);
      let wordRightInx = pos;
      while (wordRightInx + 1 < restText.length && /[^\s-]/.test(restText[wordRightInx + 1])) ++wordRightInx;
      const wordRightHalf = restText.slice(pos, wordRightInx + 1);
      // TODO: is abd|a- possible break?
      if (/[\w]{2}/.test(wordLeftHalf) && /[\w]{2}/.test(wordRightHalf)) {
        // word can be broken at pos
        updateRestTextByPos('-');
        break;
      }
      pos -= 1;
    }
    if (pos > wordLeftInx) continue;

    // word cannot be broken at pos
    pos = wordLeftInx - 1; // for ' '
    updateRestTextByPos();
  }
  console.log(paragraphs);
  return paragraphs.join('\n');
}

module.exports = nicePara;