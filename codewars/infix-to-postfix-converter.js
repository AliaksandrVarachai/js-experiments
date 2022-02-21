function toPostfix (infix) {
  const lexemes = infix.split(/(?<=[()*\+-]^)|(?=[()*\+-^])/g);
  const len = lexemes.length;

  const precedences = ['()', '^', '*/', '+-'].reverse().reduce((acc, s, i) => {
    s.split('').forEach(c => { acc[c] = i; });
    return acc;
  }, {});

  const isOperator = (lexeme) => '()^*/+-'.indexOf(lexeme) > -1;

  let pos = 0;

  function parse( isParenthesis = false) {
    debugger;
    let operands = '';
    let operators = '';
    let startP = -1;
    let prevOperand = '';
    let prevOperator = '';

    while (pos < len) {
      const c = lexemes[pos];
      if (isOperator(c)) {
        if (c === '(') {
          ++pos;
          operands = parse( true) + prevOperand;
          operators = operators + prevOperator;
          continue;
        }
        if (c === ')') {
          if (isParenthesis) ++pos;
          operands = prevOperand + operands;
          operators = operators + prevOperator;
          return operands + operators;
        }
        const p = precedences[c];
        if (startP < 0) startP = p;
        if (p > startP) {
          --pos;
          operands = operands + parse(); // because the order is changed
          // operators = prevOperator + operators;
          prevOperand = '';
        } else if (p < startP) {
          // ++pos;
          operands = operands + prevOperand;
          operators = prevOperator + operators;
          return operands + operators;
        } else {
          ++pos;
          operands = operands + prevOperand;
          operators = prevOperator + operators;
          prevOperator = c;
        }
      } else {
        ++pos;
        prevOperand = c;
      }
    }

    operands = operands + prevOperand;
    operators = prevOperator + operators;
    return operands + operators;
  }

  return parse();
}

console.log(toPostfix('1+2*8-3+4-5'))
// module.exports = {};