import { FastifyInstance } from "fastify";
import * as routes from "./routes";

const routePrimaryPrefix = "/api/v1";

export function registerAppRoutes(app: FastifyInstance) {
  app.register(async (app: FastifyInstance) => {
    for (const [routeName, route] of Object.entries(routes)) {
      console.log(`Registering route: ${routeName}`);
      app.register(route, { prefix: routePrimaryPrefix });
    }
  });

  app.get("/", async (_, reply) => {
    reply.send({
      message: "Welcome to the PDF Unlocker API",
    });
  });
}
