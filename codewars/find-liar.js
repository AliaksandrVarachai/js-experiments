function isContradiction(assertionsList) {
  const queue = [];
  const queueLen = assertionsList.length;
  const assertionsMap = assertionsList.reduce((acc, [name, a]) => {
    acc[name] = a;
    return acc;
  }, {});

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

  console.log('queue=', queue)

  let isContradictionFound = false;

  // checks queue by names
  const cached = {};
  const doubleLinkedLists = [];
  for (let [name, a] of assertionsList) {
    if (cached[name]) continue;

    // follows the dependencies chain
    const addListItem = (item) => {
      const assertion = assertionsMap[item.name];
      if (!assertion) return;
      if (assertion.manBehindMe) {
        const prevListItem = {
          name: assertion.manBehindMe,
          next: item,
        };
        // internal consistency check
        const cachedPrevItem = cached[assertion.manBehindMe];
        if (cachedPrevItem && cachedPrevItem.next !== item.name) {
          isContradictionFound = true;
          return;
        }
        // add to cache
        cached[assertion.manBehindMe] = prevListItem;
        addListItem(prevListItem);
      }
      if (assertion.manInFrontMe) {
        const nextListItem = {
          name: assertion.manInFrontMe,
          prev: item,
        };
        // internal consistency check
        const cachedNextItem = cached[assertion.manInFrontMe];
        if (cachedNextItem && cachedNextItem.prev !== item.name) {
          isContradictionFound = true;
          return;
        }
        // add to cache
        cached[assertion.manInFrontMe] = nextListItem;
        addListItem(nextListItem);
      }
    }

    if (a.manBehindMe || a.manInFrontMe) {
      const listItem = { name };
      doubleLinkedLists.push(listItem); // list entry point

      // processing of the dependencies chain
      addListItem(listItem);
      if (isContradictionFound) {
        return true;
      }
    }
  }
  // prints
  printDoubleLinkedLists(doubleLinkedLists);

  // checks queue altogether with names {
  for (let i = 0; i < queue.length; ++i) {
    const name = queue[i];
    if (cached[name]) {
      cached[name].pos = i + 1;
    }
  }


  const parseListItem = (item) => {
    if (item.prev) {
      if (item.prev.pos >= item.pos) {
        isContradictionFound = true;
        return;
      }
      parseListItem(item.prev);
    }
    if (item.next) {
      if (item.next.pos <= item.pos) {
        isContradictionFound = true;
        return;
      }
      parseListItem(item.next);
    }
  }

  for (let listEntry of doubleLinkedLists) {
    parseListItem(listEntry);
    if (isContradictionFound) {
      return true;
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

  const liars = [];
  const assertionsList = Object.entries(assertions);
  console.log('assertionsList=', assertionsList)
  for (let i = 0; i < assertionsList.length; ++i) {
    const [excludedName] = assertionsList[i];
    console.log('excludedName=', excludedName)
    const excludedAssertionList = assertionsList.slice();
    excludedAssertionList.splice(i, 1);
    console.log('excludedAssertionList=', excludedAssertionList)

    if (!isContradiction(excludedAssertionList)) {
      console.log('************** NO contradiction => liar is ', excludedName)
      liars.push(excludedName);
      if (liars.length > 1) {
        return null;
      }
    }
  }

  return liars[0];
}

module.exports = findOutMrWrong;

// prints array of double lists
function printDoubleLinkedLists(lists) {
  console.log('******* DoubleLinkedLists START')
  const array = [];
  lists.forEach(list => {
    let hasPrev = !!list?.prev;
    let item = list;
    while (hasPrev) {
      item = item.prev;
      hasPrev = !!item.prev;
    }
    let hasNext = !!item?.next;
    array.push(item);
    while (hasNext) {
      item = item.next;
      array.push(item);
      hasNext = !!item.next;
    }
  });
  console.log(array)
  console.log('******* DoubleLinkedLists END')
}