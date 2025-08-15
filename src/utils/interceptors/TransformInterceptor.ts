import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import map from "lodash/map";

interface ITransformInterceptorResponse {
  success: boolean;
  data: unknown;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data): ITransformInterceptorResponse => {
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
