const a = '0123'.split('').map(Number);
const n = a.length;
const parentheses = [];
for (let i = 0; i < n; ++i) {
  for (let j = i + 1; j <= n; ++j) {
    parentheses.push([i, j]);
  }
}
const pLen = parentheses.length;
console.log(`pLen=${pLen}:`, parentheses, );
const aMax = a.map((_, i) => i + pLen - n);
console.log('aMax:', aMax)

// упорядоченная выборка без повторений n из m
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

console.log(forbiddenParentheses)


let counter = 0
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
  console.log(a, getStringExpression())
  counter++;
} while (nextStep());
console.log('total='+counter)

function getStringExpression() {
  const str = new Array(a.length + 1).fill('0')
  const p = [];
  for (let i = 0; i <= a.length; ++i) p.push({ o: 0, c: 0 })
  for (let elA of a) {
    const [o, c] = parentheses[elA];
    p[o].o++;
    p[c].c++;
  }
  return p.map((elP, i) => '('.repeat(elP.o) + str[i] + ')'.repeat(elP.c)).join('');
}
