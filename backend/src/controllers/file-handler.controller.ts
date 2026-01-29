import { FastifyReply, FastifyRequest } from "fastify";
import { FileUpload } from "../schemas/file-handler.schema";
import { FileHandlerService } from "../services/file-handler.service";

export class FileHandlerController {
  static async unlockFile(
    request: FastifyRequest<{ Body: FileUpload }>,
    reply: FastifyReply,
  ) {
    const { file, password } = request.body;
    const unlockedFile = await FileHandlerService.unlockFile(file, password);
    reply
      .type("application/pdf")
      .header("Content-Disposition", `attachment; filename="unlocked.pdf"`)
      .send(unlockedFile);
  }
}
