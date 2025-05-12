// @LogMethodCalls
// class Calculator {
//   add(a: number, b: number): number { return a + b; }
//   subtract(a: number, b: number): number { return a - b; }
//   multiply(a: number, b: number): number { return a * b; }
//   divide(a: number, b: number): number { return a / b; }
// }
//
// const calc = new Calculator();
// console.log('***** start')
// const add = calc.add(1 , 2);
// const sub = calc.subtract(10 , 6);
// const mult = calc.multiply(7 , 3);
// const div = calc.divide(44 , 4);
// console.log('***** end', add, sub, mult, div)



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
            return super[methodName].apply(this, ...methodArgs);
          }
        })
      });
    }
  }
}

type MyClassConstructor = {
  name: string;
}

@LogMethodCalls
class MyClass2 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() { // goes to MyClass.prototype (enumerable: false)
    return this.name;
  }
}

const myWrappedClass = new MyClass2('Mike');
const nameFromWrappedClass = myWrappedClass.getName();
