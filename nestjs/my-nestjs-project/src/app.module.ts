import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { recipientUrl } from './app.middleware';
import { ProductController, CartController } from './app.controller';
import { ProductService, CartService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [ProductController, CartController],
  providers: [ProductService, CartService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(recipientUrl)
      .forRoutes('/');
  }
}
