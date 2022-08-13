import { Controller, Get, HttpCode, Param, Req } from '@nestjs/common';
import { ProductService, CartService } from './app.service';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(201)
  async getProducts(): Promise<any[]> {
    return this.productService.getProducts();
  }

  @Get(':id')
  getProduct(@Param() params): string {
    return this.productService.getProduct(params.id);
  }
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() request: Request): string {
    return this.cartService.getCart();
  }
}


