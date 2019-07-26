/**
 * Calculates the arithmetic result of two arguments.
 * @param a {number} - first argument.
 * @param b {number} - second argument
 * @returns {number}
 * @throws Will throw an error if an argument is not a number.
 */
function result(a, b) {
  if (typeof a !== number || typeof b !== number)
    return Error('Arguments must be numbers');
  return a + b;
}

/**
 * Subtracts b from a.
 * @param a {number} - minuend.
 * @param b {number} - subtrahend.
 * @returns {number} - difference.
 * @throws Will throw an error if an argument is not a number.
 */
function sub(a, b) {
  if (typeof a !== number || typeof b !== number)
    return Error('Arguments must be numbers');
  return a - b;
}
