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



function createSelectableTreeElementNode(element) {
  element.style.border = '1px solid red';
  return {
    type: Node.ELEMENT_NODE, // node,
    classList: element.classList, // TODO: sort by name
    children: []
  }
}

function createSelectableTreeTextNode(value) {
  return {
    type: Node.TEXT_NODE, // text
    value
  }
}

function isSelectableElement(element) {
  return element.classList.contains('tab-widget');
}

const selectableTree = {
  type: Node.ELEMENT_NODE,
  classList: [],  // empty for the root element
  children: []
};

function createSelectableTree() {
  function traverse(node, selectableTreePointer) {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        //child.style.background = 'red';
        if (isSelectableElement(child)) {
          const selectableTreeElementNode = createSelectableTreeElementNode(child);
          selectableTreePointer.children.push(selectableTreeElementNode);
          traverse(child, selectableTreeElementNode); //TODO: go up
        } else {
          traverse(child, selectableTreePointer)
        }
        // end for element node
      } else if (child.nodeType === Node.TEXT_NODE) {
        const textNodeValue = node.nodeValue && node.nodeValue.trim();
        if (textNodeValue) {
          selectableTreePointer.children.push(createSelectableTreeTextNode(textNodeValue));
          // end for text node
        }
      } else {
        // other types of nodes are not traversed
      }
    }
  }

  traverse(document.body, selectableTree);
}

createSelectableTree();
console.log(JSON.stringify(selectableTree, null, 2))



