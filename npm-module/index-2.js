import calculator from './index-1';

function addNumber(posNumber) {
  for (let i = 0; i < posNumber; i++) {
    calculator.increment();
    console.log(calculator.getCounter())
  }
}

export default {
  addNumber
};