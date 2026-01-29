import { FastifyRequest } from 'fastify';
import { ZodType as ZodTypeV3 } from 'zod';
import { ZodType as ZodTypeV4 } from 'zod/v4';
import logger from '../services/logger.service';
import { AppError } from '../models/error.models';

type ZodType = ZodTypeV3 | ZodTypeV4;

export function validateSchema(schema: ZodType, data: unknown) {
	const result = schema.safeParse(data);
	if (!result.success) {
		const errorMessage = result.error.issues
			.map((err: any) => `${err.path.join('.')}: ${err.message}`)
			.join(', ');

		logger.warn({ data, issues: result.error.issues }, `Validation error: ${errorMessage}`);
		throw new AppError(errorMessage, 400, 'VALIDATION_ERROR');
	}
	return result.data;
}

export const ValidateLocation = { PARAMS: 'params', QUERY: 'query', BODY: 'body' } as const;
export type ValidateLocation = typeof ValidateLocation[keyof typeof ValidateLocation];

export function createValidatorPlugin<T extends ZodType>(location: ValidateLocation, schema: T) {
	return async (request: FastifyRequest) => {
		try {
			const data = validateSchema(schema, request[location]);
			request[location] = data as any;
		} catch (error) {
			logger.error(error, `Validation failed for ${location}`);
			throw error;
		}
	};
}
