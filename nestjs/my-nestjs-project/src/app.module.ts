import { Module } from '@nestjs/common';
import { ProductController, CartController } from './app.controller';
import { ProductService, CartService } from './app.service';

@Module({
  imports: [],
  controllers: [ProductController, CartController],
  providers: [ProductService, CartService],
})
export class AppModule {}
