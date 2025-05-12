function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const product = new Product('Banana');
const title = product.title;
product.title = 'Super banana';
