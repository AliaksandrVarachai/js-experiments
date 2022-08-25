const chai = require('chai');
const { elderAgeSimple } = require('./become-immortal');

const { assert } = chai;

const testData = [
  { args: [1,4,0,100000], ans: 5 },
  { args: [8,5,1,100], ans: 5 },
  { args: [8,8,0,100007], ans: 224 },
  { args: [25,31,0,100007], ans: 11925 },
  { args: [5,45,3,1000007], ans: 4323 },
  { args: [31,39,7,2345], ans: 1586 },
  { args: [545,435,342,1000007], ans: 808451 },
];

describe('execution', () => {
  xit('Should fail comparison', () => {
    // assert.fail('Default error message');
    assert(true === false, 'Overwritten error message');
  });

  it('Should run set of simple tests', () => {;
    const actualItems = testData.map(({ args }) => elderAgeSimple(...args));
    const expectedItems = testData.map(({ ans }) => ans);
    assert.sameOrderedMembers(actualItems, expectedItems);
  });
});
