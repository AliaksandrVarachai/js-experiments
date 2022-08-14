import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BffController } from './app.controller';
import { BffService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [BffController],
  providers: [BffService],
})
export class AppModule {}
