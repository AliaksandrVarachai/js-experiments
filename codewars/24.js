const operations = [];

(function fillOperations() {
  var ops = ['+', '-', '*', '/'];
  for (var i0 = 0; i0 < 4; ++i0)
    for (var i1 = 0; i1 < 4; ++i1)
      for (var i2 = 0; i2 < 4; ++i2)
        operations.push([ops[i0], ops[i1], ops[i2]]);
})();

function getPermutations(a, b, c, d) {
  return [
    [a, b, c, d],
    [a, b, d, c],
    [a, c, b, d],
    [a, c, d, b],
    [a, d, b, c],
    [a, d, c, b],

    [b, a, c, d],
    [b, a, d, c],
    [b, c, a, d],
    [b, c, d, a],
    [b, d, a, c],
    [b, d, c, a],

    [c, a, b, d],
    [c, a, d, b],
    [c, b, a, d],
    [c, b, d, a],
    [c, d, a, b],
    [c, d, b, a],

    [d, a, b, c],
    [d, a, c, b],
    [d, b, a, c],
    [d, b, c, a],
    [d, c, a, b],
    [d, c, b, a],
  ];
}


function equalTo24(a, b, c, d){
  const permutations = getPermutations(a, b, c, d);
  for (var i = operations.length - 1; i > -1; --i) {
    var ops = operations[i];
    for (var j = permutations.length - 1; j > -1; --j) {
      var p = permutations[j];

      var expr = `${p[0]}${ops[0]}${p[1]}${ops[1]}${p[2]}${ops[2]}${p[3]}`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `(${p[0]}${ops[0]}${p[1]})${ops[1]}${p[2]}${ops[2]}${p[3]}`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `${p[0]}${ops[0]}(${p[1]}${ops[1]}${p[2]})${ops[2]}${p[3]}`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `${p[0]}${ops[0]}${p[1]}${ops[1]}(${p[2]}${ops[2]}${p[3]})`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `(${p[0]}${ops[0]}${p[1]}${ops[1]}${p[2]})${ops[2]}${p[3]}`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `${p[0]}${ops[0]}(${p[1]}${ops[1]}${p[2]}${ops[2]}${p[3]})`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `(${p[0]}${ops[0]}${p[1]})${ops[1]}(${p[2]}${ops[2]}${p[3]})`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `((${p[0]}${ops[0]}${p[1]})${ops[1]}${p[2]})${ops[2]}${p[3]}`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `(${p[0]}${ops[0]}(${p[1]}${ops[1]}${p[2]}))${ops[2]}${p[3]}`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `${p[0]}${ops[0]}((${p[1]}${ops[1]}${p[2]})${ops[2]}${p[3]})`;
      if (new Function(`return ${expr}`)() === 24) return expr;

      expr = `${p[0]}${ops[0]}(${p[1]}${ops[1]}(${p[2]}${ops[2]}${p[3]}))`;
      if (new Function(`return ${expr}`)() === 24) return expr;
    }
  }

  return "It's not possible!";
}