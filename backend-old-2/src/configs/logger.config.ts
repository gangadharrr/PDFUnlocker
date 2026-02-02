import { env } from "./env.config";

export const loggerConfig = env.VERCEL
	? {
			// Serverless: simple JSON logs
			level: env.LOG_LEVEL,
	  }
	: {
			// Local development: pretty-printed logs with colors
			level: env.LOG_LEVEL,
			transport: {
				targets: [
					{
						target: 'pino-pretty',
						level: env.LOG_LEVEL,
						options: {
							colorize: true,
							translateTime: 'SYS:standard',
							ignore: 'pid,hostname',
						},
					},
					{
						target: 'pino/file',
						level: env.LOG_LEVEL,
						options: {
							destination: env.LOGS_PATH,
							mkdir: true,
						},
					},
				],
			},
	  };
