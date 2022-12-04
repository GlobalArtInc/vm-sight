import { ArgumentsHost, Catch, ExceptionFilter as ExcepFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExcepFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    try {
      const error = (exception as HttpException | Error).message ?? {};
      response.status(response.statusCode).json({ ok: false, error });
    } catch (error) {
      response.status(response.statusCode).json({ ok: false, error });
    }
  }
}
