import {Controller, Get, HttpCode, Param, Headers} from '@nestjs/common';
import { ProductService, CartService } from './app.service';
// import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  // @Redirect('http://varachai-bff-api-dev.eu-west-1.elasticbeanstalk.com', 301) => just redirects in browser address bar
  @HttpCode(201)
  async getProducts(): Promise<any[]> {
    return this.productService.getProducts();
  }

  @Get(':id')
  async getProduct(@Param() params): Promise<any> {
    return this.productService.getProduct(params.id);
  }
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers() headers): Promise<any> {
    console.log(headers.connection) // TODO: use with Authorizaiton header
    return this.cartService.getCart();
  }
}


