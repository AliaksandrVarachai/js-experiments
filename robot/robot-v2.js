var str = '(L(R2LLL)3)2';

var actions = [];
function action(c) {
  actions.push(c);
}


function simplify(code) {
  let lexems = [];

  for (let i = 0, len = code.length; i < len; ++i) {
    const start = i;
    while (!isNaN(+code[i]))
      ++i;
    if (start < i) {
      lexems.push(+code.substring(start, i));
      --i;
    } else {
      lexems.push(code[i]);
    }
  }

  let pos = 0;
  const parentheses = [];

  while (pos < lexems.length) {
    if (typeof lexems[pos] === 'number') {
      if (lexems[pos] > 0) {
        --lexems[pos];
        --pos;
      } else {
        ++pos;
      }
    } else if (lexems[pos] === '(') {
      parentheses.push(pos);
      ++pos;
    } else if (lexems[pos] === ')') {
      if (lexems[pos + 1] > 0) {
        --lexems[pos + 1];
        pos = parentheses[parentheses.length - 1] + 1;
      } else {
        pos += 2;
      }
    } else {
      action(lexems[pos]);
      ++pos;
    }
  }
}

simplify(str);

console.log(actions.join(''));



