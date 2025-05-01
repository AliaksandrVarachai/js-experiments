function solve(str, ops) {
  const calculations = {
    t: { t: 1, f: 0 },
    f: { t: 0, f: 1 },
  };

  let oLen = 1;
  while (oLen <= ops.length) {
    for (let i = 0; i <= ops.length - oLen; ++i) {
      const o = ops.slice(i, i + oLen);
      const s = str.slice(i, i + oLen + 1);
      if (!calculations[s + o]) {
        calculations[s + o] = calc(s, o);
      }
    }
    oLen++;
  }

  return calculations[str + ops].t;

  function calc(s, op) {
    const output = { t: 0, f: 0 };
    for (let i = 0; i < op.length; i++) {
      const operator = op[i];
      const opL = op.slice(0, i);
      const opR = op.slice(i + 1);
      const sL = s.slice(0, i + 1);
      const sR = s.slice(i + 1);
      const calcL = calculations[sL + opL];
      const calcR = calculations[sR + opR];
      const { t, f } = applyOp(calcL, calcR, operator);
      output.t += t;
      output.f += f;
    }
    return output;
  }


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
}

console.log(solve("tft","^&"), 2);
console.log(solve("ttftff","|&^&&"), 16);
console.log(solve("ttftfftf","|&^&&||"), 339);
console.log(solve("ttftfftft","|&^&&||^"), 851);
console.log(solve("ttftfftftf","|&^&&||^&"), 2434);

console.log(solve("ttftfftftffttfftftftfftft","|&^&&||^&&^^|&&||^&&||&^"), 'unknown');