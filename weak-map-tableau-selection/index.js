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
};

document.addEventListener('mouseover', mouseOverHandler);






