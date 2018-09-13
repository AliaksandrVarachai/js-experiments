/**
 * Multiplies two arguments.
 * @param a {number} - multiplicand.
 * @param b {number} - multiplier.
 * @returns {number} - product.
 * @throws Will throw an error if an argument is not a number.
 */
function mult(a, b) {
  if (typeof a !== number || typeof b !== number)
    return Error('Arguments must be numbers');
  return a * b;
}
