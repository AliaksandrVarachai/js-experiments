const test = require('node:test');
const assert = require('node:assert');
const eggs = require('./eggs').default;

test('Should run test #1', () => {
  assert.strictEqual(eggs(0,14), 0);
});

test('Should run test #2', () => {
  assert.strictEqual(eggs(2,0), 0);
});

test('Should run test #3', () => {
  assert.strictEqual(eggs(2,14), 105);
});

test('Should run test #4', () => {
  assert.strictEqual(eggs(7,20), 137979);
});

test.skip('Should run test #5', () => {
  assert.strictEqual(eggs(7,500), 1_507_386_560_013_475);
  //                                   9_007_199_254_740_991
});



