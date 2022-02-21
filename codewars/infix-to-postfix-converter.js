function toPostfix (infix) {
  const lexemes = infix.split(/(?<=[()*\+-]^)|(?=[()*\+-^])/g);
  const operators = '^*/+-'.split('').reduce((acc, c) => {
    acc[c] = true;
    return acc;
  }, {});
  const precedences = ['()', '^', '*/', '+-'].reverse().reduce((acc, s, i) => {
    s.split('').forEach(c => { acc[c] = i; });
    return acc;
  }, {});
  const isLeftAssociative = (operator) => operator !== '^';

  const output = [];
  const operatorStack = [];

  for (let c of lexemes) {
    if (operators[c]) {
      let p = precedences[c];
      let topOperator = operatorStack[operatorStack.length - 1];
      while (topOperator !== '(' && (precedences[topOperator] > p || precedences[topOperator] === p && isLeftAssociative(c))) {
        output.push(operatorStack.pop());
        topOperator = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(c);
    } else if (c === '(') {
      operatorStack.push(c);
    } else if (c === ')') {
      while (operatorStack[operatorStack.length - 1] !== '(') {
        output.push(operatorStack.pop());
      }
      operatorStack.pop()
    } else {
      output.push(c);
    }
  }

  return output.join('') + operatorStack.reverse().join('');
}

const tests = [
  {expr: "1*2", answer: "12*"},
  {expr: "2+7*5", answer: "275*+"},
  {expr: "3*3/(7+1)", answer: "33*71+/"},
  {expr: "5+(6-2)*9+3^(7-1)", answer: "562-9*+371-^+"},
  {expr: "1^2^3", answer: "123^^"},
]

tests.forEach(it => {
  const actual = toPostfix(it.expr);
  console.log(actual === it.answer
    ? `"${it.expr}" test passed`
    : `"${it.expr}" test failed: actual="${actual}, expected=${it.answer}"`
  )
})
