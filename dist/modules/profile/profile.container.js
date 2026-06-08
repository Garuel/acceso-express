"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const profile_service_1 = require("./profile.service");
const profile_controller_1 = require("./profile.controller");
const datasource_config_1 = require("../../shared/infrastructure/config/datasource.config");
const local_storage_service_1 = require("../../shared/infrastructure/storage/local-storage.service");
dotenv_1.default.config();
const storageService = new local_storage_service_1.LocalStorageService();
// const storageService = process.env.NODE_ENV === 'production'
//   ? new S3StorageService()
//   : new LocalStorageService();
const profileService = new profile_service_1.ProfileService(datasource_config_1.DataSourceConfig, storageService);
const profileController = new profile_controller_1.ProfileController(profileService);
exports.profileController = profileController;
