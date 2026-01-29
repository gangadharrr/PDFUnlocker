import { spawn } from "child_process";
import { resolve } from "path";
import { PYTHON_EXECUTABLE_PATH, PYTHON_MAIN_PATH } from "../constants/file-handler.constants";

export class FileHandlerService {
  static async uploadFile(file: Buffer, password: string): Promise<Buffer> {
    const currentDir = resolve(__dirname, '..');

    const python = spawn(`${currentDir}${PYTHON_EXECUTABLE_PATH}`, [`${currentDir}${PYTHON_MAIN_PATH}`, password]);
    python.stdin.write(file);
    python.stdin.end();
    
    const chunks: Buffer[] = [];
    for await (const chunk of python.stdout) {
      chunks.push(chunk);
    }
    const unlockedFile = Buffer.concat(chunks);
    return unlockedFile;
  }
}
