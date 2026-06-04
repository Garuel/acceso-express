import { Router } from "express";
import { JtwAuthMiddleware } from "../../shared/middlewares/jwt-auth.middleware";
import { profileController } from "./profile.container";
import multer from "multer";
import { ValidationMiddleware } from "../../shared/middlewares/class-validator.middleware";
import { UploadProfilePictureDto } from "./dto/upload-profile-picture.dto";
import { AsyncHandlerUtil } from "../../shared/infrastructure/utils/async-handler.util";
import { authGuard } from "../auth/auth.container";

const profileRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

profileRouter.post(
  "/upload-profile",
  JtwAuthMiddleware(authGuard),
  upload.single("file"),
  ValidationMiddleware(UploadProfilePictureDto),
  AsyncHandlerUtil(
    profileController.uploadProfilePicture.bind(profileController),
  ),
);

export default profileRouter;
