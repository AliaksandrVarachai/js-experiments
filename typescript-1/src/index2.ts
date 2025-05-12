function LogMethodCalls<T extends { new (...args: any[]): {} }>(Class: T) {
  return class extends Class {
    constructor(...constructorArgs: any[]) {
      const item = super(...constructorArgs);
      console.log(this.__proto__, item)

      Object.entries(this).forEach(([methodName, method]: [string, any]) => {
        if (typeof method === 'function') {
          Reflect.defineProperty(this, methodName, {
            enumerable: true,
            value: (...args: any[]) => {
              console.log(`Method ${methodName} is called with args: ${args}`);
              return Reflect.apply(method, this, args);
            }
          })
        }
      });
    }
  }
}

@LogMethodCalls
class Calculator {
  add(a: number, b: number): number { return a + b; }
  subtract(a: number, b: number): number { return a - b; }
  multiply(a: number, b: number): number { return a * b; }
  divide(a: number, b: number): number { return a / b; }
}

const calc = new Calculator();
console.log('***** start')
const add = calc.add(1 , 2);
const sub = calc.subtract(10 , 6);
const mult = calc.multiply(7 , 3);
const div = calc.divide(44 , 4);
console.log('***** end', add, sub, mult, div)



// JS template works!
type ClassType<A extends unknown[] = unknown[]> = { new (...args: A) };

function wrapper<A extends unknown[]>(Constructor: ClassType<A>) {
  return class Wrapper extends Constructor {
    constructor(...args: A) {
      super(...args);
      const myClassMethodNames = Object.getOwnPropertyNames(Constructor.prototype).filter(name => name !== 'constructor');
      myClassMethodNames.forEach(methodName => {
        const method = Constructor.prototype[methodName];
        if (typeof method !== 'function') return;
        // MyWrappedClass.prototype => Object.create(MyClass.prototype) => MyClass.prototype is not staled
        Object.defineProperty(Wrapper.prototype, methodName, {
          enumerable: true,
          value: (...methodArgs: unknown[]) => {
            console.log(`${methodName} is called`);
            return super[methodName].apply(this, ...methodArgs);
          }
        })
      })
      this.url = 'MyUrl';
    }
  }
}

class MyClass {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() { // goes to MyClass.prototype (enumberable: false)
    return this.name;
  }
}

const WrappedClass = wrapper(MyClass);
const myWrappedClass = new WrappedClass('Mike');
const nameFromWrappedClass = myWrappedClass.getName();

console.log(nameFromWrappedClass)


const myClass = new MyClass('George');
const name = myClass.getName();
console.log(name);

