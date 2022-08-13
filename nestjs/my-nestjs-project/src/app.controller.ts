import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ProductService, CartService } from './app.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(201)
  getProducts(): string {
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
  getCart(): string {
    return this.cartService.getCart();
  }
}


