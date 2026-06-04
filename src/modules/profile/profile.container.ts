import dotenv from "dotenv";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { DataSourceConfig } from "../../shared/infrastructure/config/datasource.config";
import { JwtService } from "../jwt/jwt.service";
import { LocalStorageService } from "../../shared/infrastructure/storage/local-storage.service";

dotenv.config();


const storageService = new LocalStorageService();

// const storageService = process.env.NODE_ENV === 'production'
//   ? new S3StorageService()
//   : new LocalStorageService();

const profileService = new ProfileService(DataSourceConfig, storageService);
const profileController = new ProfileController(profileService);

export { profileController };
