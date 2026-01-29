import { z } from 'zod';

const validatePayloadWithZod = <TSchema extends z.ZodSchema<unknown>>(
	schema: TSchema,
	payload: unknown,
	message: string = 'Payload did not satisfy schema',
): z.infer<TSchema> => {
	try {
		return schema.parse(payload);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.issues
				.map(err => {
					return `${err.path.join('.')}: ${err.message}`;
				})
				.join('\n');

			const summarized = error.issues.map((i: z.ZodIssue) => ({
				path: Array.isArray(i.path) && i.path.length ? i.path.join('.') : '(root)',
				message: i.message,
			}));
			console.warn(`Zod validation failed: ${message} errors:${JSON.stringify(summarized)}`);

			throw new Error(`❌ ${message}:\n${errors}`);
		}
		console.error({ err: error }, `Unexpected error in zod validation: ${message}`);
		throw error;
	}
};

export default validatePayloadWithZod;
