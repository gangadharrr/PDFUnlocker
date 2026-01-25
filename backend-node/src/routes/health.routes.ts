import { FastifyInstance } from "fastify";

export function healthRoutes(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/health",
    handler: async (_, reply) => {
      const healthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };

      reply.status(200).send(healthStatus);
    },
  });
}
