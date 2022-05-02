import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  LoggerService,
  Inject,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const { errorCode }: any = exception.getResponse();
    let constraints = undefined;

    if (
      status === HttpStatus.BAD_REQUEST &&
      exception.stack.includes('ValidationPipe.exceptionFactory') &&
      typeof exception.getResponse() === 'object'
    ) {
      const { message: msgResponse }: any = exception.getResponse();
      constraints = msgResponse;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url,
      errorCode,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || null
          : 'Internal server error',
      constraints,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${status} ${request.url}`,
        exception.stack,
        HttpExceptionFilter.name,
      );
    } else {
      this.logger.error(
        `${request.method} ${status} ${request.url}`,
        `${JSON.stringify(errorResponse)}`,
        HttpExceptionFilter.name,
      );
    }

    response.status(status).json(errorResponse);
  }
}
