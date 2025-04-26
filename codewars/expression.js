function solve(s, ops) {
  const a = [];
  for (let i = 0; i < ops.length; ++i) a.push(i);
  const n = a.length;
  const parentheses = [];
  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j <= n; ++j) {
      parentheses.push([i, j]);
    }
  }
  const pLen = parentheses.length;
  const aMax = a.map((_, i) => i + pLen - n);

  function nextStep() {
    let i = n - 1;
    while (i >= 0 && a[i] === aMax[i]) i--;
    if (i < 0) return false;
    a[i]++;
    let k = i + 1;
    while (k < n) {
      a[k] = a[i] + k - i;
      k++;
    }
    return true;
  }

  const forbiddenParentheses = parentheses.map(([o, c], inx) => {
    const set = new Set();
    for (let i = 0; i < parentheses.length; ++i) {
      if (i === inx) continue;
      const [o1, c1] = parentheses[i];
      if ((o1 < o && o <= c1 && c1 < c) || (o < o1 && o1 <= c && c < c1)) set.add(i);
    }
    return set;
  });

  console.time('test');
  // TODO: replace ineffective algorightm
  let trueCounter = 0
  do {
    const forbidden = new Set();
    let isForbidden = false;
    for (let pInx of a) {
      if (forbidden.has(pInx)) {
        isForbidden = true;
        break;
      }
      forbiddenParentheses[pInx].forEach(i => forbidden.add(i));
    }
    if (isForbidden) continue;
    const strExpression = getStringExpression();
    const ast = toAST(strExpression);
    const result = calculateAST(ast);

    if (result) trueCounter++;
  } while (nextStep());
  console.timeEnd('test');

  return trueCounter;

  function getStringExpression() {
    const p = [];
    for (let i = 0; i <= a.length; ++i) p.push({ o: 0, c: 0 })
    for (let elA of a) {
      const [o, c] = parentheses[elA];
      p[o].o++;
      p[c].c++;
    }
    return p.map((elP, i) => {
      if (elP.c) {
        return '('.repeat(elP.o) + s[i] + ')'.repeat(elP.c) +  ops[i];
      }
      return '('.repeat(elP.o) + s[i] + (ops[i] ?? '') + ')'.repeat(elP.c)
    }).join('');
  }

  function toAST(expr) {
    let p = 1; // ignore the 1st and the last parenthesis
    function createAST(node) {
      let val = expr[p];
      while (p < expr.length - 1 && val !== ')') {
        if (val === '(') {
          p++;
          if (node.l === undefined) node.l = createAST({});
          else node.r = createAST({});
        } else if (val === 't' || val === 'f') {
          if (node.l === undefined) {
            node.l = val;
          } else {
            node.r = val;
          }
          p++;
        } else {
          node.op = val;
          p++;
        }
        val = expr[p];
      }
      p++;
      return node;
    }
    return createAST({});
  }

  function calculateAST(ast) {
    let l, r;
    if (typeof ast.l === 'object') {
      l = calculateAST(ast.l);
    } else {
      l = ast.l === 't';
    }
    if (typeof ast.r === 'object') {
      r = calculateAST(ast.r);
    } else {
      r = ast.r === 't';
    }
    switch(ast.op) {
      case '&': return l && r;
      case '|': return l || r;
      case '^': return (l && !r) || (!l && r);
      default: throw Error(`Unknown operator ${ast.op}`);
    }
  }
}

// console.log(solve("ttftff","|&^&&"), 16);
// console.log(solve("ttftfftf","|&^&&||"), 339);
console.log(solve("ttftfftft","|&^&&||^"), 851);

