data = [
  [10, 20],
  [30, 40],
  [80, 30],
  [50, 65],
  [40, 90],
];

/**
 * Renderer Instance
 */
const rendererInstance = (function() {
  const domElement = document.getElementById('canvas');
  const ctx = domElement.getContext('2d');
  const startSelectPos = {
    x: 0,
    y: 0
  };

  function drawDataPoints(data, rect = {}, style = {}) {
    // { strokeStyle: 'gray', fillStyle: 'pink'}
    // TODO: check if data is inside of rect for selection
    data.forEach(datum => drawDot(datum[0], datum[1], style));
  }

  function startSelect(x, y) {
    console.log(`startSelect: (${x}, ${y})`);
    startSelectPos.x = x;
    startSelectPos.y = y;
    drawDot(x, y);
  }

  function stopSelectPoint(x, y) {
    console.log(`stopSelectPoint: (${x}, ${y})`);
    drawDot(x, y)
  }

  function updateSelectPoint(x, y) {
    console.log(`updateSelectPoint: (${x}, ${y})`);
    drawDot(startSelectPos.x, startSelectPos.y)
  }

  function updateSelectGroupPoints(x, y) {
    drawRect(x, y, startSelectPos.x, startSelectPos.y, true);
  }

  function stopSelectGroupPoints(x, y) {
    console.log(`stopSelectGroupPoints: (${x}, ${y})`);
    drawRect(x, y, startSelectPos.x, startSelectPos.y, true);
  }

  function drawDot(x, y, customStyle = {}) {
    const defaultStyle = {
      strokeStyle: 'black',
      fillStyle: 'red',
    };
    const style = {...defaultStyle, ...customStyle};
    Object.keys(style).forEach(key => {
      ctx[key] = style[key];
    });

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  function drawRect(startX, startY, endX, endY, clear = false) {
    if (clear)
      ctx.clearRect(0, 0, domElement.width, domElement.height);
    ctx.getLineDash();
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  }


  return {
    domElement,
    drawDataPoints,
    startSelect,
    updateSelectPoint,
    updateSelectGroupPoints,
    stopSelectPoint,
    stopSelectGroupPoints,
  };
})();


/**
 * Chart Instance
 */
const chartInstance = (function({domElement, startSelect, updateSelectPoint, updateSelectGroupPoints, stopSelectPoint, stopSelectGroupPoints}) {
  let rect;
  let border;
  let mouseDownPos = {clientX: 0, clientY: 0};
  const clickThreshold = 10;
  let isMouseDown = false;

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

  function update() {
    rect = domElement.getBoundingClientRect();
    const domElementStyle = getComputedStyle(domElement);
    border = {
      left: parseFloat(domElementStyle.getPropertyValue('border-left')),
      top: parseFloat(domElementStyle.getPropertyValue('border-top'))
    };
    isMouseDown = false;
  }

  update();

  function mouseMoveHandler(event) {
    const {x, y} = toCanvasCoordinateSystem(event.clientX, event.clientY);
    if (isMouseDown) {
      if (checkClickThreshold(event.clientX, event.clientY)) {
        // process a click
        updateSelectPoint(x, y);
      } else {
        // draw a rectangle
        updateSelectGroupPoints(x, y);
      }
    } else {
      // highlight points under the cursor
      console.log(event.clientX, event.clientY);
    }
  }

  domElement.onmouseenter = event => {
    isMouseMoveHandlerActive = true;
    addEventListener('mousemove', mouseMoveHandler);
  };

  domElement.onmouseleave = event => {
    isMouseMoveHandlerActive = false;
    removeEventListener('mousemove', mouseMoveHandler);
  };

  domElement.onmousedown = event => {
    isMouseDown = true;
    mouseDownPos.clientX = event.clientX;
    mouseDownPos.clientY = event.clientY;
    const {x, y} = toCanvasCoordinateSystem(event.clientX, event.clientY);
    startSelect(x, y);
  };

  domElement.onmouseup = event => {
    const {x, y} = toCanvasCoordinateSystem(event.clientX, event.clientY);
    isMouseDown = false;
    if (checkClickThreshold(event.clientX, event.clientY)) {
      // process a click
      stopSelectPoint(x, y);
    } else {
      // process a border selection
      stopSelectGroupPoints(x, y);
    }
  };

  window.onresize = update;

  return {
    domElement,
    rect,
    border,
  }

})({
  domElement: rendererInstance.domElement,
  // drawDataPoints: rendererInstance.drawDataPoints,
  startSelect: rendererInstance.startSelect,
  updateSelectPoint: rendererInstance.updateSelectPoint,
  updateSelectGroupPoints: rendererInstance.updateSelectGroupPoints,
  stopSelectPoint: rendererInstance.stopSelectPoint,
  stopSelectGroupPoints: rendererInstance.stopSelectGroupPoints
});

