function solve(str, ops) {
  function applyOp(a, b, op) {
    let t, f;
    switch(op) {
      case '&':
        t = a.t * b.t;
        f = (a.t + a.f) * (b.t + b.f) - t;
        break;
      case '|':
        f = a.f * b.f;
        t = (a.t + a.f) * (b.t + b.f) - f;
        break;
      case '^':
        t = a.t * b.f + a.f * b.t;
        f = a.t * b.t + a.f * b.f;
        break;
      default:
        throw Error(`Unknown operator ${op}`);
    }
    return { t, f };
  }

  let counter = 0;
  function calc(s, o) {
    counter++;
    if (counter % 1000 === 0) {
      console.log(s.length)
    }
    if (s.length === 1) {
      return s === 't' ? { t: 1, f: 0 } : { t: 0, f: 1 };
    }
    const output = { t: 0, f: 0 };
    for (let i = 0; i < s.length - 1; ++i) {
      const operator = o[i];
      const sL = s.slice(0, i + 1);
      const sR = s.slice(i + 1);
      const opL = o.slice(0, i);
      const opR = o.slice(i + 1);
      const l = calc(sL, opL);
      const r = calc(sR, opR);
      const { t, f } = applyOp(l, r, operator);
      output.t += t;
      output.f += f;
    }
    return output;
  }

  const { t } = calc(str, ops);
  return t;
}

console.log(solve("tft","^&"), 2);
console.log(solve("ttftff","|&^&&"), 16);
console.log(solve("ttftfftf","|&^&&||"), 339);
console.log(solve("ttftfftft","|&^&&||^"), 851);
console.log(solve("ttftfftftf","|&^&&||^&"), 2434);

console.log(solve("ttftfftftffttfftftftfftft","|&^&&||^&&^^|&&||^&&||&^"), 'unknown');