let selectableElements = document.getElementsByTagName('p'); // all tabWidgets
for (let i = 0; i < selectableElements.length; i++) {
  // TODO: filter only visible ( width/height > 0, visibility != hidden, display != hidden)
}
const weakMapSelectableElements = new WeakMap();
for (let i = 0; i < selectableElements.length; i++) {
  weakMapSelectableElements.set(selectableElements[i], i); //add some info about object
}

// returns Node || null
function getNearestSelectableParentNode(element) {
  let currentElement = element;
  while (currentElement && !weakMapSelectableElements.has(currentElement)) {
    currentElement = currentElement.parentNode;
  }
  return currentElement;
}

const selectedStyle = {
  background: 'yellow',
  color: 'red'
};
const selectedStyles = Object.keys(selectedStyle).map(propName => [propName, selectedStyle[propName]]);
const originStyles = selectedStyles.map(([propName, propValue]) => [propName, '']);


function selectElement(element) {
  selectedStyles.forEach(([propName, propValue], inx) => {
    originStyles[inx][1] = element.style.getPropertyValue(propName);
    element.style.setProperty(propName, propValue);
  });
}

function unselectElement(element) {
  originStyles.forEach(([propName, propValue]) => {
    element.style.setProperty(propName, propValue);
  });
}

let selectedElement = null;

function mouseOverHandler(event) {
  const nearestSelectableParentNode = getNearestSelectableParentNode(event.target);
  if (selectedElement) {
    if (nearestSelectableParentNode) {
      if (selectedElement === nearestSelectableParentNode)
        return;
      unselectElement(selectedElement);
      selectedElement = nearestSelectableParentNode;
      selectElement(selectedElement);
    } else {
      unselectElement(selectedElement);
      selectedElement = null;
    }
  } else {
    if (nearestSelectableParentNode) {
      selectedElement = nearestSelectableParentNode;
      selectElement(selectedElement);
    }
  }
}

document.addEventListener('mouseover', mouseOverHandler);


// function areArraysEqual(arr1, arr2) {
//   if (arr1.length !== arr2.length)
//     return false;
//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] !== arr2[i])
//       return false;
//   }
//   return true;
// }

function createSelectableTreeElementNode(element, parent) {
  const sortedClassList = [];
  element.classList.forEach(className => {
    const loweredClassName = className.toLowerCase();
    let isInserted = false;
    for (let i = 0; i < sortedClassList.length; i++) {
      if (loweredClassName.localeCompare(sortedClassList[i]) < 0) {
        sortedClassList.splice(i, 0, loweredClassName);
        isInserted = true;
        break;
      }
    }
    if (!isInserted)
      sortedClassList.push(loweredClassName);
  });
  // element.style.border = '1px solid red';
  return {
    type: Node.ELEMENT_NODE,
    classList: sortedClassList.join(' '),
    children: [],
    parent
  }
}

function createSelectableTreeTextNode(value, parent) {
  return {
    type: Node.TEXT_NODE, // text
    value: value.substring(0, 100),
    parent
  }
}

// Do we really need to filter invisible elements?
function isSelectableElement(element) {
  if (!element.classList.contains('tab-widget'))
    return false;
  const computedStyle = getComputedStyle(element);
  if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' ||
      computedStyle.height === '0px' || computedStyle.width === '0px')
    return false;
  return true;
}

let selectableTree = {
  type: Node.ELEMENT_NODE,
  classList: [],  // empty for the root element
  children: []
};

let textMap;
let classListMap;

// DFS implementation
function traverseSelectableTree(node, callback) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === Node.ELEMENT_NODE) {
      callback(node);
      traverseSelectableTree(child, callback);
    } else if (child.type === Node.TEXT_NODE) {
      callback(node);
    } else {
      throw Error(`Node type "${child.nodeType}" is not supported in selectableTree.`);
    }
  }
}

// fills selectableTree, textMap, classListMap
function createSelectableTree() {
  function traverseDOM(node, selectableTreePointer, callback) {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (isSelectableElement(child)) {
          const selectableTreeElementNode = createSelectableTreeElementNode(child);
          selectableTreePointer.children.push(selectableTreeElementNode);
          selectableTreePointer.parent = node;
          traverseDOM(child, selectableTreeElementNode); //TODO: go up
        } else {
          traverseDOM(child, selectableTreePointer)
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        const textNodeValue = node.nodeValue && node.nodeValue.trim();
        if (textNodeValue) {
          selectableTreePointer.children.push(createSelectableTreeTextNode(textNodeValue));
          selectableTreePointer.parent = node;
        }
      } else {
        // other types of nodes are not traversed
      }
    }
  }

  traverseDOM(document.body, selectableTree);

  textMap = {};
  classListMap = {};
  traverseSelectableTree(selectableTree, function fillMaps(selectableNode) {
    if (selectableNode.type === Node.ELEMENT_NODE) {
      const classList = selectableNode.classList;
      if (classListMap[classList]) {
        classListMap[classList].push(selectableNode);
      } else {
        classListMap[classList] = [selectableNode];
      }
    } else if (selectableNode.type === Node.TEXT_NODE) {
      const value = selectableNode.value;
      if (textMap[value]) {
        textMap[value].push(selectableNode)
      } else {
        textMap[value] = [selectableNode]
      }
    }
  })
}

createSelectableTree();
// console.log(JSON.stringify(
//   selectableTree,
//   (key, value) => key === 'parent' ? undefined : value,
//   2
// ));

console.log(textMap, classListMap);

// ******************************************
// load selectableTree & create proper textMap & classListMap
let loadedSelectableTree = selectableTree;
let loadedTextMap = textMap;
let loadedClassListMap = classListMap;
let loadedTourStepIds = { // is filled when loaded
  '0000-0001': true,
  '0000-0002': true,
};
let loadedTourStepsLeaved = {
  '0000-0001': false,
  '0000-0002': false,  // removed
};

Object.keys(loadedTextMap).forEach(textKey => {
  // loadedSelectableTree contains tour step IDs
  if (!loadedTextMap[textKey])
    return;
  Object.keys(loadedTextMap).forEach(loadedTextKey => {
    let parent = classListMap[textKey].parent;
    let loadedParent = loadedClassListMap[loadedTextKey].parent;
      if (areSelectableNodesEqual(parent, loadedParent)) {
        if (loadedParent.tourId) {
          loadedTourStepsLeaved[tourId] = true;
        }
      }
  })
});



function areSelectableNodesEqual(node1, node2) {
  if (node1.nodeType !== node2.nodeType) {
    return false
  } else if (node1.nodeType === Node.TEXT_NODE) {
    return node1.nodeValue === node2.nodeValue;
  } else if (node1.nodeType === Node.ELEMENT_NODE) {
    return node1.classList === node2.classList; // we are do not care about children
  }
  throw Error(`"Node type ${node1.nodeType}" is not supported when nodes are compared.`)
}







