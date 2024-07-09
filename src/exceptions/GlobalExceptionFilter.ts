import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    // Log detailed error information for internal use
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`
    );

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Invalid Request',
      });
    } else {
      const errorResponse = exception instanceof HttpException ? exception.getResponse() : {
        message: 'An unexpected error occurred',
        error: 'Error',
        statusCode: status,
      };

      // Ensure errorResponse is always an object before spreading
      const errorResponseObj = typeof errorResponse === 'object' && errorResponse !== null ? errorResponse : { message: errorResponse };

      response.status(status).json({
        ...errorResponseObj,
      });
    }
  }
}
