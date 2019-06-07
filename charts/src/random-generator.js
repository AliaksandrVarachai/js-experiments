const cephes = require('cephes');

// returns array of values or null
function generateValues({ name = 'normal', length = 100, params = {} }) {
  // TODO: redo as a ArrayBuffer (application/contet-stream)
  const generatedValues = new Array(length);

  switch (name) {
    case 'normal': {
      const {mean = 0, sigma = 1} = params;
      for (let i = 0; i < length; i++) {
        generatedValues[i] = cephes.ndtri(Math.random()) * sigma + mean;
      }
      return generatedValues;
    }

    case 'uniform': {
      const {min = -10, max = 10} = params;
      for (let i = 0; i < length; i++) {
        generatedValues[i] = (max - min) * Math.random() + min;
      }
      return generatedValues;
    }

    default:
      console.error(`Distribution "${name}" is not supported.`);
      return null;
  }
}

module.exports = {
  generateValues
};