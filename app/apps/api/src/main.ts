import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import * as cookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { GlobalExceptionFilter } from '@app/shared/filters/global-exception.filter';
import { ValidationError } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ValidationException } from '@app/shared/filters/validation-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });
  app.use(cookieParser());
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg = {} as Record<string, unknown>;
        errors.forEach((err) => {
          errMsg[err.property] = [...Object.values(err.constraints)];
        });

        return new ValidationException(errMsg);
      },
    })
  );
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: '',
  });

  const config = new DocumentBuilder().setTitle('VM-SIGHT API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(80);
}
bootstrap();
