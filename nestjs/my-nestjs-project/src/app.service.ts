import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  async getProducts(): Promise<any[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'product1',
          }, {
            id: 'product2',
          }
        ]);
      }, 500);
    });
  }
  getProduct(id: string): string {
    return JSON.stringify({ id, description: 'some description' })
  }
}

@Injectable()
export class CartService {
  getCart(): string {
    return JSON.stringify({
      id: 'cart1',
      productIds: ['product1', 'product2'],
    });
  }
}
