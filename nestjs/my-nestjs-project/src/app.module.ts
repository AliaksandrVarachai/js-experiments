import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ProductController, CartController } from './app.controller';
import { ProductService, CartService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [ProductController, CartController],
  providers: [ProductService, CartService],
})
export class AppModule {}
