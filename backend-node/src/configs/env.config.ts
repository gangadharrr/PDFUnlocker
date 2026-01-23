import { z } from 'zod';
import validatePayloadWithZod from '../utils/zod.util';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.string().default('info'),
  LOGS_PATH: z.string().default('./logs/app.log'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
});

export const env = validatePayloadWithZod(
	EnvSchema,
	process.env,
	'❌ Invalid environment variables',
);