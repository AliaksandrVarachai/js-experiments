/**
 * Utilizes the scale transformation of data to a canvas size and vise versa.
 * @param {number} domainMin - minimum of the origin data.
 * @param {number} domainMax - maximum of the origin data.
 * @param {number} rangeMin - minimum of the shown range.
 * @param {number} rangeMax - maximum of the shown range.
 * @constructor
 */
export default function SceneScaler([domainMin, domainMax], [rangeMin, rangeMax]) {
  let dDomain = 1;
  let dRange = 1;

  /**
   * Scales origin data to adjust its range to a scene size.
   * @param {number} x - real value to be shown.
   * @returns {number} - scaled value for a target scene.
   */
  this.toRange = function(x) {
    return rangeMin + dRange / dDomain * (x - domainMin);
  };

  /**
   * Reverse scaling of a shown on a scene value to the origin value.
   * @param {number} y - value from a target scene.
   * @returns {number} - origin value.
   */
  this.toDomain = function(y) {
    return domainMin + dDomain / dRange * (y - rangeMin);
  };

  /**
   * Scales linear size to adjust it to a scene size.
   * @param {number} size - real size to be shown.
   * @returns {number} - scaled size for a target scene.
   */
  this.toRangeW = function(size) {
    return dRange / dDomain * size;
  };

  /**
   * Updates the data ranges for scaling.
   * @param {number} newDomainMin - minimum of the origin data.
   * @param {number} newDomainMax - maximum of the origin data.
   * @param {number} newRangeMin - minimum of the shown range.
   * @param {number} newRangeMax - maximum of the shown range.
   */
  this.update = function([newDomainMin, newDomainMax], [newRangeMin, newRangeMax]) {
    if (newDomainMin === newDomainMax || newRangeMin === newRangeMax)
      throw Error('Both domain and range must contain different elements.');
    domainMin = newDomainMin;
    domainMax = newDomainMax;
    rangeMin = newRangeMin;
    rangeMax = newRangeMax;
    dDomain = newDomainMax - newDomainMin;
    dRange = newRangeMax - newRangeMin;
  };

  // Constructor
  this.update([domainMin, domainMax], [rangeMin, rangeMax]);
}
