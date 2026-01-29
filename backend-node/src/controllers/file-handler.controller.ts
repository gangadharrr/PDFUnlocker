import { FastifyReply, FastifyRequest } from "fastify";
import { FileUpload } from "../schemas/file-handler.schema";
import { FileHandlerService } from "../services/file-handler.service";

export class FileHandlerController {
  static async uploadFile(request: FastifyRequest<{ Body: FileUpload }>, reply: FastifyReply) {
    const { file, password } = request.body;
    const unlockedFile = await FileHandlerService.uploadFile(file, password);
    reply.type("application/pdf").header("Content-Disposition", `attachment; filename="unlocked.pdf"`).send(unlockedFile);
  }
}