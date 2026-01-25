import fastifyCors from "@fastify/cors";
import fastify, { FastifyError, FastifyInstance } from "fastify";
import { env } from "./configs/env.config";
import { loggerConfig } from "./configs/logger.config";
import { registerAppRoutes } from "./app-router";

function buildApp(): FastifyInstance {
  const app = fastify({ logger: loggerConfig });
  app.register(fastifyCors,{
		origin: env.CORS_ORIGINS,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setNotFoundHandler((_, reply) => {
    reply.code(404).send({
      message: 'Resource not found',
    });
  });

  app.setErrorHandler((error: FastifyError, _, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode ?? 500;
    reply.code(statusCode).send({
      message: error.message || 'Internal Server Error',
    });
  });
  
  registerAppRoutes(app);
  return app;
}

// root level app instance
const app = buildApp();
export default app;