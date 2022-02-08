import { strict as assert } from 'assert';
// import assert from 'assert/strict';

assert.deepEqual(
  [
    [[1, 2, 3]],
    4,
    5
  ],
  [
    [[1, 2, '3']],
    4,
    5
  ]);