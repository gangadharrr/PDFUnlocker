
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly details?: any;
	public readonly isOperational: boolean;
	public readonly isAppError = true;

	constructor(
		message: string,
		statusCode: number = 500,
		code: string = 'INTERNAL_ERROR',
		details?: any,
		isOperational: boolean = true,
	) {
		super(message);
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string, details?: any) {
		super(message, 400, 'BAD_REQUEST_ERROR', details);
	}
}

export class ValidationError extends BadRequestError {}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Access denied', details?: any) {
		super(message, 401, 'AUTHORIZATION_ERROR', details);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Access denied', details?: any) {
		super(message, 403, 'FORBIDDEN_ERROR', details);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found', details?: any) {
		super(message, 404, 'NOT_FOUND_ERROR', details);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Resource conflict', details?: any) {
		super(message, 409, 'CONFLICT_ERROR', details);
	}
}

export class InternalServerError extends AppError {
	constructor(message: string, details?: any) {
		super(message, 500, 'INTERNAL_SERVER_ERROR', details);
	}
}

export class ExternalServiceError extends AppError {
	constructor(message: string, details?: any) {
		super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
	}
}

export class ServiceNotConfiguredError extends AppError {
	constructor(message: string = 'Service is not configured', details?: any) {
		super(message, 503, 'SERVICE_NOT_CONFIGURED', details);
	}
}
