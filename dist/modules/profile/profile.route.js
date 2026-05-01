"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../../shared/middlewares/jwt-auth.middleware");
const profile_container_1 = require("./profile.container");
const multer_1 = __importDefault(require("multer"));
const class_validator_middleware_1 = require("../../shared/middlewares/class-validator.middleware");
const upload_profile_picture_dto_1 = require("./dto/upload-profile-picture.dto");
const async_handler_util_1 = require("../../shared/infrastructure/utils/async-handler.util");
const profileRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
profileRouter.post("/upload-profile", (0, jwt_auth_middleware_1.JtwAuthMiddleware)(profile_container_1.authGuard), upload.single("file"), (0, class_validator_middleware_1.ValidationMiddleware)(upload_profile_picture_dto_1.UploadProfilePictureDto), (0, async_handler_util_1.AsyncHandlerUtil)(profile_container_1.profileController.uploadProfilePicture.bind(profile_container_1.profileController)));
exports.default = profileRouter;
