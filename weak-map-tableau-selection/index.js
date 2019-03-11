function createSelectableVTreeElementNode(element, vParent) {
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
    domElement: element,
    classList: sortedClassList.join(' '),
    children: [],
    parent: vParent
  }
}

function createSelectableVTreeTextNode(element, vParent) {
  return {
    type: Node.TEXT_NODE,
    domElement: element,
    value: element.nodeValue.trim().substring(0, 100),
    parent: vParent
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

let selectableVTree = {
  type: Node.ELEMENT_NODE,
  classList: [],  // empty for the root element
  children: [],
  parent: null
};

let textVMap;
let classListVMap;

// DFS implementation
// if callback(node) returns false then stop traversing children of node
function traverseSelectableVTree(vNode, callback) {
  for (let i = 0; i < vNode.children.length; i++) {
    const vChild = vNode.children[i];
    if (vChild.type === Node.ELEMENT_NODE) {
      if (callback(vChild) === false)
        break;
      traverseSelectableVTree(vChild, callback);
    } else if (vChild.type === Node.TEXT_NODE) {
      callback(vChild);
    } else {
      throw Error(`Node type "${vChild.nodeType}" is not supported in selectableTree.`);
    }
  }
}

// fills selectableVTree, textVMap, classListVMap
function createSelectableVTree() {
  function traverseDOM(node, selectableVTreePointer) {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (isSelectableElement(child)) {
          const selectableVTreeElementNode = createSelectableVTreeElementNode(child, selectableVTreePointer);
          selectableVTreePointer.children.push(selectableVTreeElementNode);
          //selectableVTreeElementNode.parent = node;
          traverseDOM(child, selectableVTreeElementNode); //TODO: go up
        } else if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          traverseDOM(child, selectableVTreePointer)
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        let isTextNodeAmongChildren = false; // Just the 1st text node is a header
        for (let k = 0; k < selectableVTreePointer.children.length; k++) {
          if (selectableVTreePointer.children[k].type === Node.TEXT_NODE) {
            isTextNodeAmongChildren = true;
            break;
          }
        }
        if (isTextNodeAmongChildren)
          continue;
        const textNodeValue = child.nodeValue && child.nodeValue.trim();
        if (textNodeValue) {
          const selectableVTreeTextNode = createSelectableVTreeTextNode(child, selectableVTreePointer);
          selectableVTreePointer.children.push(selectableVTreeTextNode);
          //selectableVTreeTextNode.parent = node;
        }
      } else {
        // other types of nodes are not traversed
      }
    }
  }

  traverseDOM(document.body, selectableVTree);

  textVMap = {};
  classListVMap = {};
  traverseSelectableVTree(selectableVTree, function fillVMaps(selectableVNode) {
    if (selectableVNode.type === Node.ELEMENT_NODE) {
      const classList = selectableVNode.classList;
      if (classListVMap[classList]) {
        classListVMap[classList].push(selectableVNode);
      } else {
        classListVMap[classList] = [selectableVNode];
      }
    } else if (selectableVNode.type === Node.TEXT_NODE) {
      const value = selectableVNode.value;
      if (textVMap[value]) {
        textVMap[value].push(selectableVNode)
      } else {
        textVMap[value] = [selectableVNode]
      }

    }
    return true;
  })
}

createSelectableVTree();
// console.log(JSON.stringify(
//   selectableVTree,
//   (key, value) => key === 'parent' ? undefined : value,
//   2
// ));
console.log(selectableVTree);

console.log(textVMap, classListVMap);


// ***********************************
// Highlighting of selectable elements

const weakMapSelectableElements = new WeakMap();
traverseSelectableVTree(selectableVTree, vNode => {
  if (vNode.type === Node.ELEMENT_NODE)
    weakMapSelectableElements.set(vNode.domElement, vNode);
  return true;
});

// returns DOM Node || null
function getNearestSelectableParentNode(element) {
  let currentElement = element;
  while (currentElement && !weakMapSelectableElements.has(currentElement)) {
    currentElement = currentElement.parentNode;
  }
  return currentElement;
}

// TODO: replace with overlay
const selectedStyle = {
  border: '2px solid red'
  // background: 'yellow',
  // color: 'red'
};
const selectedStyles = Object.keys(selectedStyle).map(propName => [propName, selectedStyle[propName]]);
const originStyles = selectedStyles.map(([propName, propValue]) => [propName, '']);


function selectElement(element) {
  const el = element.nodeType === Node.ELEMENT_NODE ? element : element.parentNode;
  selectedStyles.forEach(([propName, propValue], inx) => {
    originStyles[inx][1] = el.style.getPropertyValue(propName);
    el.style.setProperty(propName, propValue);
  });
}

function unselectElement(element) {
  const el = element.nodeType === Node.ELEMENT_NODE ? element : element.parentNode;
  originStyles.forEach(([propName, propValue]) => {
    el.style.setProperty(propName, propValue);
  });
}

let selectedVElement = null; // virtual element

function mouseOverHandler(event) {
  const nearestSelectableParentNode = getNearestSelectableParentNode(event.target);
  if (!nearestSelectableParentNode)
    return;
  const oldSelectedVElement = selectedVElement;
  selectedVElement = weakMapSelectableElements.get(nearestSelectableParentNode);
  if (oldSelectedVElement) {
    if (selectedVElement === oldSelectedVElement)
      return;
    unselectElement(oldSelectedVElement.domElement);
    selectElement(selectedVElement.domElement);
  } else {
    selectElement(selectedVElement.domElement);
  }
}

document.addEventListener('mouseover', mouseOverHandler);

function getNextSelectableVElement(vElement) {
  if (!vElement || vElement.children && vElement.children.length)
    return vElement.children[0];
  let vParent = vElement;
  let index = -1;
  do {
    vElement = vParent;  // TODO: remove the shadowing
    vParent = vParent.parent;
    if (!vParent)
      return selectableVTree.children[0];
    index = vParent.children.indexOf(vElement);
  } while (index === vParent.children.length - 1);
  return vParent.children[index + 1];
}

// finding last selectable element is not very good for performance
function getLastSelectableVElement(selectableVTree) {
  return (function _getLastSelectableElement(vElement) {
    if (!vElement.children || vElement.children.length === 0)
      return vElement;
    return _getLastSelectableElement(vElement.children[vElement.children.length - 1]);
  })(selectableVTree);
}

function getPreviousSelectableVElement(vElement) {
  if (!vElement.parent) {
    return getLastSelectableVElement(selectableVTree);
  }
  let vParent = vElement;
  let index = -1;
  do {
    vElement = vParent;  // TODO: remove the shadowing
    vParent = vParent.parent;
    if (!vParent)
      return getLastSelectableVElement(selectableVTree);
    index = vParent.children.indexOf(vElement);
  } while (index === 0);
  return vParent.children[index - 1];
}

// The possibility of choice elements with keyboard (some elements can be inaccessible for the selection with the mouse)
function selectTargetWithKey(event) {
  if (!selectedVElement && selectableVTree.children.length === 0)
    throw Error ('There are not selectable elements');
  if (event.altKey && event.key === 'ArrowLeft') {
    if (selectedVElement) {
      unselectElement(selectedVElement.domElement);
      selectedVElement = getPreviousSelectableVElement(selectedVElement);
    } else {
      selectedVElement = selectableVTree.children[0];
    }
    selectElement(selectedVElement.domElement);
    // TODO: scroll to the selected element
    // document.documentElement.scrollTop = document.body.scrollTop = selectedVElement.domElement.offsetTop;
  } else if (event.altKey && event.key === 'ArrowRight') {
    if (selectedVElement) {
      unselectElement(selectedVElement.domElement);
      selectedVElement = getNextSelectableVElement(selectedVElement);
    } else {
      selectedVElement = getLastSelectableVElement(selectableVTree);
    }
    selectElement(selectedVElement.domElement);
    // TODO: scroll to the selected element
    document.documentElement.scrollTop = document.body.scrollTop = selectedVElement.domElement.offsetTop;
  }

}

document.addEventListener('keydown', selectTargetWithKey);




