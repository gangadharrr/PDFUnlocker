import { FastifyInstance } from "fastify";
import { FileHandlerController } from "../controllers/file-handler.controller";
import {
  createValidatorPlugin,
  ValidateLocation,
} from "../middlewares/validation.middleware";
import { FileUploadSchema } from "../schemas/file-handler.schema";

export function registerFileHandlerRoutes(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/unlock",
    preHandler: [
      createValidatorPlugin(ValidateLocation.BODY, FileUploadSchema),
    ],
    handler: FileHandlerController.unlockFile,
  });
}
