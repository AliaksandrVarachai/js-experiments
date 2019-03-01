var selectedElement = document.getElementsByClassName('selected-elem')[0];
var step = document.getElementsByClassName('arrow-box')[0];
var posButtons = {
  top1: document.querySelector('#top-bt-1+.tour-pos-lb'),
  top2: document.querySelector('#top-bt-2+.tour-pos-lb'),
  top3: document.querySelector('#top-bt-3+.tour-pos-lb'),
  bottom1: document.querySelector('#bottom-bt-1+.tour-pos-lb'),
  bottom2: document.querySelector('#bottom-bt-2+.tour-pos-lb'),
  bottom3: document.querySelector('#bottom-bt-3+.tour-pos-lb'),
  left1: document.querySelector('#left-bt-1+.tour-pos-lb'),
  left2: document.querySelector('#left-bt-2+.tour-pos-lb'),
  left3: document.querySelector('#left-bt-3+.tour-pos-lb'),
  right1: document.querySelector('#right-bt-1+.tour-pos-lb'),
  right2: document.querySelector('#right-bt-2+.tour-pos-lb'),
  right3: document.querySelector('#right-bt-3+.tour-pos-lb'),
  center1: document.querySelector('#center-bt-1+.tour-pos-lb')
}
var overlays = {
  left: document.getElementById('tour-overlay-left'),
  top: document.getElementById('tour-overlay-top'),
  right: document.getElementById('tour-overlay-right'),
  bottom: document.getElementById('tour-overlay-bottom'),
}
var targetElement = selectedElement;
var stepPosition = 'bottom-1';
var html = document.documentElement; // can be changed when tab reloads

function placeStepOverlay(rect) {
  var htmlHeight = Math.max(html.clientHeight, html.clientHeight, html.scrollHeight);

  overlays.left.style.left = 0 + 'px';
  overlays.left.style.width = rect.left + 'px';
  overlays.left.style.top = rect.top + 'px';
  overlays.left.style.height = rect.height + 'px';

  overlays.right.style.left = rect.right + 'px';
  overlays.right.style.right = 0 + 'px';
  overlays.right.style.top = rect.top + 'px';
  overlays.right.style.height = rect.height + 'px';

  overlays.top.style.left = 0 + 'px';
  overlays.top.style.right = 0 + 'px';
  overlays.top.style.top = 0 + 'px';
  overlays.top.style.height = rect.top + 'px';

  overlays.bottom.style.left = 0 + 'px';
  overlays.bottom.style.right = 0 + 'px';
  overlays.bottom.style.top = rect.bottom + 'px';
  overlays.bottom.style.bottom = 0 + 'px';
  overlays.bottom.style.height = htmlHeight - rect.bottom + 'px';
}

function placeStepPositionButtons(rect) {
  var d = 7;  //half of pos-button size
  var s = 2 * d;   //more then halp of pos-button size
  posButtons.top1.style.top = posButtons.top2.style.top = posButtons.top3.style.top = rect.top - d + 'px';
  posButtons.bottom1.style.top = posButtons.bottom2.style.top = posButtons.bottom3.style.top = rect.bottom + d + 'px';
  posButtons.left1.style.left = posButtons.left2.style.left = posButtons.left3.style.left = rect.left - d + 'px';
  posButtons.right1.style.left = posButtons.right2.style.left = posButtons.right3.style.left = rect.right + d + 'px';
  posButtons.top1.style.left = posButtons.bottom1.style.left = rect.left + s + 'px';
  posButtons.top2.style.left = posButtons.bottom2.style.left = posButtons.center1.style.left = (rect.left + rect.right) / 2 + 'px';
  posButtons.top3.style.left = posButtons.bottom3.style.left = rect.right - s + 'px';
  posButtons.left1.style.top = posButtons.right1.style.top = rect.top + s + 'px';
  posButtons.left2.style.top = posButtons.right2.style.top = posButtons.center1.style.top = (rect.top + rect.bottom) / 2 + 'px';
  posButtons.left3.style.top = posButtons.right3.style.top = rect.bottom - s + 'px';
}

function placeStep(targetRect, position) {
  var arrowDistance = 20; // from CSS
  var borderWidth = 4;    // from CSS
  var arrowWithBorderDistance = Math.ceil(arrowDistance + borderWidth * (Math.SQRT2 - 1));
  var stepRect = step.getBoundingClientRect();

  switch (position) {
    case 'top-1':
      step.style.left = targetRect.left + 'px';
      step.style.top = targetRect.top - stepRect.height - arrowWithBorderDistance + 'px';
      break;
    case 'top-2':
      step.style.left = (targetRect.left + targetRect.right - stepRect.width) / 2 + 'px';
      step.style.top = targetRect.top - stepRect.height - arrowWithBorderDistance + 'px';
      break;
    case 'top-3':
      step.style.left = targetRect.right - stepRect.width + 'px';
      step.style.top = targetRect.top - stepRect.height - arrowWithBorderDistance + 'px';
      break;

    case 'bottom-1':
      step.style.left = targetRect.left + 'px';
      step.style.top = targetRect.bottom + arrowWithBorderDistance + 'px';
      break;
    case 'bottom-2':
      step.style.left = (targetRect.left + targetRect.right - stepRect.width) / 2 + 'px';
      step.style.top = targetRect.bottom + arrowWithBorderDistance + 'px';
      break;
    case 'bottom-3':
      step.style.left = targetRect.right - stepRect.width + 'px';
      step.style.top = targetRect.bottom + arrowWithBorderDistance + 'px';
      break;

    case 'left-1':
      step.style.left = targetRect.left - stepRect.width - arrowWithBorderDistance + 'px';
      step.style.top = targetRect.top + 'px';
      break;
    case 'left-2':
      step.style.left = targetRect.left - stepRect.width - arrowWithBorderDistance + 'px';
      step.style.top = (targetRect.top + targetRect.bottom - stepRect.height) / 2 + 'px';
      break;
    case 'left-3':
      step.style.left = targetRect.left - stepRect.width - arrowWithBorderDistance + 'px';
      step.style.top = targetRect.bottom - stepRect.height + 'px';
      break;

    case 'right-1':
      step.style.left = targetRect.right + arrowWithBorderDistance + 'px';
      step.style.top = targetRect.top + 'px';
      break;
    case 'right-2':
      step.style.left = targetRect.right + arrowWithBorderDistance + 'px';
      step.style.top = (targetRect.top + targetRect.bottom - stepRect.height) / 2 + 'px';
      break;
    case 'right-3':
      step.style.left = targetRect.right + arrowWithBorderDistance + 'px';
      step.style.top = targetRect.bottom - stepRect.height + 'px';
      break;

    case 'center-1':
      step.style.left = (targetRect.left + targetRect.right - stepRect.width) / 2 + 'px';
      step.style.top = (targetRect.top + targetRect.botton - stepRect.height) / 2 + 'px';

    default:
      console.error('"' + stepPosition + '" is wrong!');
  }
}

var rect = {};
function updateStepLayoutOnResize() {
  //var rect = targetElement.getBoundingClientRect();
  var _rect = targetElement.getBoundingClientRect(); // BAD!!!
  rect = getDocumentRect(_rect);
  placeStepOverlay(rect);
  placeStepPositionButtons(rect);
  placeStep(rect, stepPosition);
}

(function mountStepLayout() {
  updateStepLayoutOnResize();
})();

window.onresize = updateStepLayoutOnResize;

function getDocumentRect(clientRect) {
  return {
    top: clientRect.top + scrollY,
    bottom: clientRect.bottom + scrollY,
    left: clientRect.left + scrollX,
    right: clientRect.right + scrollX,
    width: clientRect.width,
    height: clientRect.height
  }
}

/* scrolling*/
var last_scroll_pos = 0;

function updateStepLayoutOnScroll(e) {
  var d = window.scrollY - last_scroll_pos;
  last_scroll_pos = window.scrollY;

}

window.onscroll = function(e) {
  var scrollY = window.scrollY;
  var d = scrollY - last_scroll_pos;
  last_scroll_pos = scrollY;
//   rect.top -= d;
//   rect.bottom -= d;
  placeStepOverlay(rect);
  //requestAnimationFrame();
  placeStepPositionButtons(rect);
  placeStep(rect, stepPosition);
  console.log(scrollY, rect.top, d)
};




document.onchange = function(event) {
  var target = event.target;
  if (target.tagName !== 'INPUT' || target.getAttribute('type') !== 'radio')
    return;
  if (target.name === 'tour-pos-bt') {
    //TODO: change CSS style of stepElement related to arrow orientation
    stepPosition = target.value;
    //var rect = targetElement.getBoundingClientRect();
    var _rect = targetElement.getBoundingClientRect();
    rect = getDocumentRect(_rect);
    placeStep(rect, stepPosition);
  }
};















