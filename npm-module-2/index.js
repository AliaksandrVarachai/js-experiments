import calculatorSimple from 'npm-module/dist/calculator.simple';
import calculatorExtended from 'npm-module/dist/calculator.extended';

// const calculator = {
//   simple: require('npm-module/dist/calculator.simple'),
//   extended: require('npm-module/dist/calculator.extended'),
// };

console.log('index-2 is loaded');
console.log(calculatorSimple.getCounter());
calculatorSimple.increment();
calculatorSimple.increment();
calculatorSimple.increment();
calculatorSimple.increment();
console.log(calculatorSimple.getCounter());
// calculatorSimple.resetCounter();
// console.log(calculatorSimple.getCounter());

console.log('-----------------');
calculatorExtended.addNumber(100);
console.log(calculatorSimple.getCounter());