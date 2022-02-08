const { describe, expect, it } = require('./test-lib');
const add = (x, y) => x + y;

describe('tests cases for some Math functions', () => {
  expect(add(4, 4)).toBe(8);
});