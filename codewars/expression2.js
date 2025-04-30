function solve(str, ops) {
  let counter = 0;

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

  function calc(s, o) {
    debugger;
    if (s.length === 1) {
      return s === 't' ? { t: 1, f: 0 } : { t: 0, f: 1 };
    }
    const output = { t: 0, f: 0 };
    for (let i = 1; i < s.length - 1; ++i) {
      const operator = o[i - 1];
      const sL = s.slice(0, i);
      const opL = o.slice(0, i - 1);
      const sR = s.slice(i);
      const opR = o.slice(i)
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