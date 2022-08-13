import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './app.controller';
import { ProductService } from './app.service';

describe('AppController', () => {
  let productController: ProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = app.get<ProductController>(ProductController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productController.getProducts()).toBe(expect.any(Object));
    });
  });
});
