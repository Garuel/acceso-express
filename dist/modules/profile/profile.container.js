"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = exports.profileController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const auth_guard_1 = require("../../shared/guards/auth.guard");
const profile_service_1 = require("./profile.service");
const profile_controller_1 = require("./profile.controller");
const datasource_config_1 = require("../../shared/infrastructure/config/datasource.config");
const jwt_service_1 = require("../jwt/jwt.service");
const local_storage_service_1 = require("../../shared/infrastructure/storage/local-storage.service");
dotenv_1.default.config();
const accessJwtService = new jwt_service_1.JwtService(process.env.JWT_ACCESS_SECRET, "15m");
const refreshJwtService = new jwt_service_1.JwtService(process.env.JWT_REFRESH_SECRET, "7d");
const storageService = new local_storage_service_1.LocalStorageService();
// const storageService = process.env.NODE_ENV === 'production'
//   ? new S3StorageService()
//   : new LocalStorageService();
const authGuard = new auth_guard_1.AuthGuard(accessJwtService);
exports.authGuard = authGuard;
const profileService = new profile_service_1.ProfileService(datasource_config_1.DataSourceConfig, storageService);
const profileController = new profile_controller_1.ProfileController(profileService);
exports.profileController = profileController;
