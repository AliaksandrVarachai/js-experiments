import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'

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
  async getProduct(id: string): Promise<any> {
    return { id, description: 'some description' };
  }
}

@Injectable()
export class CartService {
  constructor(private readonly httpService: HttpService) {}

  async getCart(): Promise<any> {
    const response = await this.httpService.axiosRef.get(process.env.CART_SERVICE);
    console.log(response.data);
    return response.data;
  }
}
