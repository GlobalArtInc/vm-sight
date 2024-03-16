import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from './validation-exception.filter';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // private logger = new Logger();
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    (exception as HttpException | Error).message += ` error requestId: ${request.headers['x-request-id']}`;
    // this.logger.error(exception as any, LogSubTopic.Error);
    (exception as HttpException | Error).message = (exception as HttpException | Error).message.split(
      ' error requestId'
    )[0];
    let message = (exception as HttpException | Error).message ?? ({} as any);

    switch (exception.constructor) {
      case HttpException:
        break;
      case ValidationException:
        message = (exception as ValidationException).validationErrors;
        break;
      default:
        message = (exception as Error)?.message;
    }

    if (message && typeof message === 'object') {
      const firstKey = Object.keys(message)[0];
      if (firstKey) {
        message = message?.[firstKey][0];
      }
    }
    try {
      const statusCode = (exception as { response: Response })?.response?.statusCode || 200;
      response.status(statusCode).json({ statusCode, error: message });
    } catch (error) {
      response.status(500).send({ message: 'error' });
    }
  }
}
