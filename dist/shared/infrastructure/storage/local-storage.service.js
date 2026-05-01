"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LocalStorageService {
    async upload(file, folder) {
        const rootPath = path_1.default.resolve(__dirname, "../../../../uploads", folder);
        if (!fs_1.default.existsSync(rootPath))
            fs_1.default.mkdirSync(rootPath, { recursive: true });
        const fileName = `${Date.now()}-${file.originalname}`;
        const fullPath = path_1.default.join(rootPath, fileName);
        fs_1.default.writeFileSync(fullPath, file.buffer);
        return `/uploads/${folder}/${fileName}`; // URL local
    }
}
exports.LocalStorageService = LocalStorageService;
