@LogMethodCalls
class Calculator {
  // methods go to Calculator.prototype (enumerable: false)
  add(a: number, b: number): number { return a + b; }
  subtract(a: number, b: number): number { return a - b; }
  multiply(a: number, b: number): number { return a * b; }
  divide(a: number, b: number): number { return a / b; }
}

const calc = new Calculator();
console.log('result = ' + calc.add(1 , 2));
console.log('result = ' + calc.subtract(10 , 6));
console.log('result = ' + calc.multiply(7 , 3));
console.log('result = ' + calc.divide(44 , 4));

type Constructable = new(...args: any[]) => any;

function LogMethodCalls<T extends Constructable>(Constructor: T) {
  return class Wrapper extends Constructor {
    constructor(...args: any[]) {
      super(...args);
      const myClassMethodNames = Object.getOwnPropertyNames(Constructor.prototype).filter(name => name !== 'constructor');
      myClassMethodNames.forEach(methodName => {
        const method = Constructor.prototype[methodName];
        if (typeof method !== 'function') return;
        // MyWrappedClass.prototype => Object.create(MyClass.prototype) => MyClass.prototype is not staled
        Object.defineProperty(Wrapper.prototype, methodName, {
          enumerable: true,
          value: (...methodArgs: any[]) => {
            console.log(`Method "${methodName}" is called with args: ${methodArgs}`);
            // method === super[methodName]
            return super[methodName].apply(this, methodArgs);
          }
        })
      });
    }
  }
}
