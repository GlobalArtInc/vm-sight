import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true, snapshot: true });
  app.use(cookieParser());

  await app.listen(80);
}
bootstrap();
