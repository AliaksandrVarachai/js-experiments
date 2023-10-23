const test = require('node:test');
const assert = require('node:assert');
const { default: eggs, coef } = require('./eggs');

test('Should chack coefs', () => {
  const results = [];
  results[0] = coef(0,5);
  results[1] = coef(1,5);
  results[2] = coef(2,5);
  let sum = 0;
  for (const res of results) sum += res;

  assert.strictEqual(results[0], 1);
  assert.strictEqual(results[1], 5);
  assert.strictEqual(results[2], 10);
  assert.strictEqual(results[3], 10);
});

test.skip('Should run test #1', () => {
  assert.strictEqual(eggs(0,14), 0);
});

test.skip('Should run test #2', () => {
  assert.strictEqual(eggs(2,0), 0);
});

test.skip('Should run test #3', () => {
  assert.strictEqual(eggs(2,14), 105);
});

test.skip('Should run test #4', () => {
  assert.strictEqual(eggs(7,20), 137979);
});

test.skip('Should run test #5', () => {
  assert.strictEqual(eggs(7,500), 1_507_386_560_013_475);
  //                                 max 9_007_199_254_740_991
});



