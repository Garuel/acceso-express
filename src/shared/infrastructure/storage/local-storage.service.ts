import fs from "fs";
import path from "path";
import { IStorageService } from "../../domain/interfaces/storage.interface";

export class LocalStorageService implements IStorageService {
  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const rootPath = path.resolve(__dirname, "../../../../uploads", folder);
    if (!fs.existsSync(rootPath)) fs.mkdirSync(rootPath, { recursive: true });

    const fileName = `${Date.now()}-${file.originalname}`;
    const fullPath = path.join(rootPath, fileName);

    fs.writeFileSync(fullPath, file.buffer);
    return `/uploads/${folder}/${fileName}`; // URL local
  }
}
