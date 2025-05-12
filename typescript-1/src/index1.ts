function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string|number, b: string|number): string|number {
  if(typeof a === 'string' && typeof b === 'string') return a + b;
  else if(typeof a === 'number' && typeof b === 'number') return a + b;
  throw Error('Both arguments must be string or number');
}

function sum(numbers: number[], divider: number = 1) {
  return numbers.reduce((a, n) => n + a) / divider;
}

export {
  combine,
  sum,
};

