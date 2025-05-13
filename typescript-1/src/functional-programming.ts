// pure function
function add(a: number, b: number): number {
  return a + b;
}

// immutable array
const readonlyArray: readonly number[] = [1,2,3,4];
// readonlyArray.push(5) = 22; => error

// higher-order function
function mapArray(arr: readonly number[], fn: (el: number) => number): number[] {
  return arr.map(el => fn(el));
}

const readonlyArray2 = mapArray(readonlyArray, (el) => el * el);
const arr = [10,20,30];
const arr2 = mapArray(arr, (el) => 100 - el);
console.log(`[${readonlyArray}] => [${readonlyArray2}]`);
console.log(`[${arr}] => [${arr2}]`);

// curring
type CurryingMultiply = (a: number) => (b: number) => number;
const multiply: CurryingMultiply = (a) => (b) => a * b;

console.log(`Curring: 7 * 8 = ${multiply(7)(8)}`);

// function composition
type Compose = (f: (arg: any) => any, g: (arg: any) => any) => (arg: any) => any;
const compose: Compose = (f, g) => (arg) => f(g(arg));

const mult = (a: number) => 100 * a;
const square = (a: number) => 10 + a;
const res = compose(mult, square)(3);
console.log(`f(a) = 100 * a; g(a) = 10 + a; compose(f, g)(3) = (100 * (10 + 3)) = ${res}`);