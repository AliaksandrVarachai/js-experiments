/**
 * Utilizes recalculating of canvas coordinates to scene coordinates.
 * @param {Object} renderer - instance of a renderer.
 * @param {Vector2} targetMousePosition - Vector2 which stores calculated scene coordinates.
 * @constructor
 */
export default function MousePosTransformer(renderer, targetMousePosition) {
  let rect, borderLeft, borderTop, height;
  const canvas = renderer.domElement;

  // TODO: call update on resize and scroll
  /**
   * Updates sizes of the scene.
   */
  this.updateSceneSize = function() {
    rect = canvas.getBoundingClientRect();
    const canvasStyle = getComputedStyle(canvas);
    borderLeft = parseFloat(canvasStyle.getPropertyValue('border-left'));
    borderTop = parseFloat(canvasStyle.getPropertyValue('border-top'));
    height = renderer.getSize().height;
  };

  /**
   * Recalculates mouse position from canvas coordinates to scene coordinates. Result will be saved in targetMousePosition.
   * @param {number} clientX - x position of the mouse in canvas coordinates.
   * @param {number} clientY - y position of the mouse in canvas coordinates.
   */
  this.toRange = function(clientX, clientY) {
    targetMousePosition.x = clientX - rect.left - borderLeft;
    targetMousePosition.y = height - (clientY - rect.top - borderTop);
  };

  // Constructor
  this.updateSceneSize();
}
