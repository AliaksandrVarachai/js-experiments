import eventBus from './event-bus/event-bus';
import SceneManager from './scene-manager/scene-manager';


const canvas = document.getElementById('boxplot');
const sceneManager = new SceneManager(canvas);
let rect;
let border;
const mouseDownPos = {clientX: 0, clientY: 0};
const clickThreshold = 10;
let isMouseDown = false;

window.addEventListener('SpotfireLoaded', initializeAdvancedBoxPlot);

function initializeAdvancedBoxPlot() {
  updateSize();

  window.onresize = updateSize;

  function mouseMoveHandler(event) {
    const {x, y} = toCanvasCoordinateSystem(event.clientX, event.clientY);
    if (isMouseDown) {
      if (checkClickThreshold(event.clientX, event.clientY)) {
        // process a click
        eventBus.dispatch('updateSelectPoint', x, y);
      } else {
        // draw a rectangle
        eventBus.dispatch('updateSelectGroupPoints', x, y);
      }
    } else {
      // highlight points under the cursor
      //TODO: implement highlight just when cursor is paused over some point?
      eventBus.dispatch('highlightPoint', x, y);
    }
    sceneManager.update()
  }

  domElement.onmouseenter = event => {
    addEventListener('mousemove', mouseMoveHandler);
  };

  domElement.onmouseleave = event => {
    removeEventListener('mousemove', mouseMoveHandler);
  };

  domElement.onmousedown = event => {
    isMouseDown = true;
    mouseDownPos.clientX = event.clientX;
    mouseDownPos.clientY = event.clientY;
    const {x, y} = toCanvasCoordinateSystem(event.clientX, event.clientY);
    eventBus.dispatch('startSelect', x, y);
  };

  domElement.onmouseup = event => {
    const {x, y} = toCanvasCoordinateSystem(event.clientX, event.clientY);
    isMouseDown = false;
    if (checkClickThreshold(event.clientX, event.clientY)) {
      // process a click
      eventBus.dispatch('finishSelectPoint', x, y);
    } else {
      // process a border selection
      eventBus.dispatch('finishSelectGroupPoints', x, y);
    }
  };

  sceneManager.update();
}

function updateSize() {
  // TODO: check if we need to rerender canvas after resizing
  rect = canvas.getBoundingClientRect();
  const canvasStyle = getComputedStyle(canvas);
  border = {
    left: parseFloat(canvasStyle.getPropertyValue('border-left')),
    top: parseFloat(canvasStyle.getPropertyValue('border-top'))
  };
  isMouseDown = false;
  sceneManager.onWindowResize();
}

function checkClickThreshold(clientX, clientY) {
  return Math.abs(mouseDownPos.clientX - clientX) <= clickThreshold &&
    Math.abs(mouseDownPos.clientY - clientY) <= clickThreshold
}

function toCanvasCoordinateSystem(clientX, clientY) {
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}
