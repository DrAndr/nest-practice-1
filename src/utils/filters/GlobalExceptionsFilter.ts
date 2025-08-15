import {ArgumentsHost, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";

/**
 * Catch and mutate exceptions for arrive the common format
 */
export class GlobalExceptionsFilter implements ExceptionFilter {

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest();
		const res = ctx.getResponse();

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

		res.status(status).json({
			success: false,
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: req.url
		})
	}

}