const a = '012345'.split('').map(Number);
const n = a.length;
const parentheses = [];
for (let i = 0; i < n; ++i) {
  for (let j = i + 1; j < n; ++j) {
    parentheses.push([i, j]);
  }
}
const pLen = parentheses.length;
console.log(parentheses, `pLen=${pLen}`);
const aMax = a.map((_, i) => i + pLen - n);
console.log(aMax)
console.log(a);

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


let counter = 1
while (nextStep()) {
  console.log(a)
  counter++;
}
console.log('total='+counter)