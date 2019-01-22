let counter = 0;

function increment() {
  return ++counter;
}

function getCounter() {
  return counter;
}

function resetCounter() {
  counter = 0;
}

module.exports = {
  increment,
  getCounter,
  resetCounter,
};