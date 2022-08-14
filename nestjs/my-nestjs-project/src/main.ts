import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {recipientUrl} from './app.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(recipientUrl);
  await app.listen(3000);
}
bootstrap();
