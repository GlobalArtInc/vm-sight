import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  ok: boolean;
  result: T;
}

const ignoreTransform = ['/logs'];

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        if (ignoreTransform.some((substr) => req['path'].includes(substr))) {
          return data;
        }

        return { ok: true, result: data };
      }),
    );
  }
}
