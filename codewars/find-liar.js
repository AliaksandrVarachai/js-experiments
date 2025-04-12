function isContradiction(assertionsList) {
  const queueLen = assertionsList.length + 1;
  const queue = new Array(queueLen).fill('');

  // checks queue by numbers
  for (let [name, a] of assertionsList) {
    if (a.myPosition) {
      const pos = a.myPosition - 1;
      if (queue[pos] && queue[pos] !== name) return true;
      queue[pos] = name;
    }
    if (a.peopleInFrontMe) {
      const pos = a.peopleInFrontMe;
      if (queue[pos] && queue[pos] !== name) return true;
      queue[pos] = name;
    }
    if (a.peopleBehindMe) {
      const pos = queueLen - a.peopleBehindMe - 1;
      if (queue[pos] && queue[pos] !== name) return true;
      queue[pos] = name;
    }
  }

  const nameRelationsMap = {
    // John: {
    //   next: 'Ivan',
    //   prev: 'John',
    // },
    // Ivan: {
    //   next: undefined,
    //   prev: 'John',
    // }
  };

  function canBeSequentialInQueue(name1, name2) {
    let pos1 = -1, pos2 = -1;
    for (let i = 0; i < queueLen; ++i) {
      if (name1 === queue[i]) {
        pos1 = i;
      } else if (name2 === queue[i]) {
        pos2 = i;
      }
    }
    if (pos1 < 0 && pos2 < 0) return true;
    if (pos1 < 0) return pos2 > 0 && !queue[pos2 - 1];
    if (pos2 < 0) return pos1 < queueLen - 1 && !queue[pos1 + 1];
    return pos2 - pos1 === 1;
  }

  // checks self-contradiction between names & with queue
  for (let [name, a] of assertionsList) {
    if (!nameRelationsMap[name]) {
      nameRelationsMap[name] = {};
    }
    const nameRelation = nameRelationsMap[name];
    const next = a?.manBehindMe;
    const prev = a?.manInFrontMe;
    if (next) {
      if (!nameRelationsMap[next]) {
        nameRelationsMap[next] = {};
      }
      const nextNameRelation = nameRelationsMap[next];
      if (!canBeSequentialInQueue(name, next)) return true;
      if (!nameRelation.next) {
        nameRelation.next = next;
      } else if (nameRelation.next !== next) {
        return true; // isContradictionFound
      }
      if (!nextNameRelation.prev) {
        nextNameRelation.prev = name;
      } else if (nextNameRelation.prev !== name) {
        return true; // isContradictionFound
      }
    }
    if (prev) {
      if (!nameRelationsMap[prev]) {
        nameRelationsMap[prev] = {}
      }
      const prevNameRelation = nameRelationsMap[prev];
      if (!canBeSequentialInQueue(prev, name)) return true;
      if (!nameRelation.prev) {
        nameRelation.prev = prev;
      } else if (nameRelation.prev !== prev) {
        return true; // isContradictionFound
      }
      if (!prevNameRelation) {
        debugger;
      }
      if (!prevNameRelation.next) {
        prevNameRelation.next = name;
      } else if (prevNameRelation.next !== name) {
        return true; // isContradictionFound
      }
    }
  }
}

function findOutMrWrong(conversation) {
  const assertions = {};

  for (let phrase of conversation) {
    const [name, assertion] = phrase.split(':');
    if (!assertions[name]) {
      assertions[name] = {
//         myPosition: NaN,
//         manBehindMe: '',
//         manInFrontMe: '',
//         peopleBehindMe: NaN,
//         peopleInFrontMe: NaN,
      };
    };
    const man = assertions[name];

    if (assertion.startsWith('I\'m in')) {
      const position = Number.parseInt(assertion.match(/\d+/)[0]);
      man.myPosition = position;
    } else if (assertion.startsWith('The man behind me is')) {
      const name = assertion.slice('The man behind me is'.length).match(/\w+/)[0];
      man.manBehindMe = name;
    } else if (assertion.startsWith('The man in front of me is')) {
      const name = assertion.slice('The man in front of me is'.length).match(/\w+/)[0];
      man.manInFrontMe = name;
    } else if (assertion.endsWith('people behind me.')) {
      const number = Number.parseInt(assertion.match(/\d+/)[0]);
      man.peopleBehindMe = number;
    } else if (assertion.endsWith('people in front of me.')) {
      const number = Number.parseInt(assertion.match(/\d+/)[0]);
      man.peopleInFrontMe = number;
    } else {
      throw Error('Assertion is not listed');
    }
  }

  // assertions{} are filled up now
  const liars = new Set(Object.keys(assertions));
  const assertionsList = Object.entries(assertions);
  for (let i = 0; i < assertionsList.length; ++i) {
    const [excludedName] = assertionsList[i];
    const excludedAssertionList = assertionsList.slice();
    excludedAssertionList.splice(i, 1);
    if (isContradiction(excludedAssertionList)) {
      liars.delete(excludedName)
    }
  }

  // find list of trusted then filter them out of liars:
  const assertionsMap = assertionsList.reduce((acc, [name, a]) => {
    acc[name] = a;
    return acc;
  }, {});
  const trustedSet = new Set();
  for (let [name, a] of assertionsList) {
    if (a.manBehindMe) {
      if (assertionsMap[a.manBehindMe].manInFrontMe === name) {
        trustedSet.add(name, a.manBehindMe);
      }
    }
    if (a.manInFrontMe) {
      if (assertionsMap[a.manInFrontMe].manBehindMe === name) {
        trustedSet.add(name, a.manInFrontMe);
      }
    }
  }
  for (let trusted of trustedSet) {
    liars.delete(trusted);
  }

  return liars.size === 1 ? liars.keys().next().value : null;
}

module.exports = findOutMrWrong;