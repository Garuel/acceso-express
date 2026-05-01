export interface IStorageService {
  upload(file: Express.Multer.File, path: string): Promise<string>;
}
