import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    if (req) {
      const { originalUrl, method } = req;
      const { statusCode } = res;

      return next
        .handle()
        .pipe(
          tap((resp) =>
            this.logger.debug(
              `${method} ${statusCode} ${originalUrl} ${
                Date.now() - now
              } ms | request: ${JSON.stringify(
                req.body,
              )} | respose: ${JSON.stringify(resp)}`,
              context.getClass().name,
            ),
          ),
        );
    }
  }
}
