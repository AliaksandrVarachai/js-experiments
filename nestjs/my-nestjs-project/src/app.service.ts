import { Injectable, HttpCode } from '@nestjs/common';

@Injectable()
export class ProductService {
  getProducts(): string {
    return JSON.stringify([
      {
        id: 'product1',
      }, {
        id: 'product2',
      }
    ]);
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
