const { assert, config } = require('chai');
const { describe, it } = require('node:test');
const wrap_cube = require('./wrap-cube');


const shapes = [
  // ["ABCDE", [["A", "E"]]],
  [
    `
  A
  B
CDEFG
  H
  I
`,
    [["A", "I", "C", "G"]]
  ],
//   [
//     `
// ABC
//  D
//  E
//  F
// `,
//     []
//   ],
//   ["ABC\nDEF", null],
//   ["ABD", []],
//   ["  ABCD  \n  E\n  F\n  G\n", [["F", "C"]]],
//   [
//     `
// A B
// CDE
// a b
// `,
//     [
//       ["A", "B"],
//       ["b", "a"]
//     ]
//   ]
];

var testit = function(a, b) {
  var fullsort = function(a) {
    try{
      var res = [];
      a.forEach(x => res.push(x.sort()));
      return JSON.stringify(res.sort());
    }catch(error){
      return a;
    }
  };
  if (b == null) {
    assert.equal(a, null);
  } else {
    assert.equal(fullsort(a), fullsort(b));
  }
};
describe("Sample Tests", function() {
  for (let [shape, answer] of shapes) {
    it("Test Shape:\n\n"+shape,()=>{
      testit(wrap_cube(shape), answer);})
  }
});

