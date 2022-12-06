import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder().setTitle('VM-SIGHT API').setVersion('1.0').build();

  const swagger = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, swagger);
  process.setMaxListeners(0);

  process.on('warning', (e) => {
    return;
  });
  process.on('uncaughtException', () => {
    return;
  });

  await app.listen(3000);
}
bootstrap();
