import { Router } from "express";
import { authController } from "./auth.container";
import { ValidationMiddleware } from "../../shared/middlewares/class-validator.middleware";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PreRegisterDto } from "./dto/pre-register.dto";
import { RefreshDto } from "./dto/refresh.dto";

const router = Router();

router.post(
  "/login",
  ValidationMiddleware(LoginDto),
  authController.login.bind(authController),
);
router.post(
  "/register",
  ValidationMiddleware(RegisterDto),
  authController.register.bind(authController),
);

router.post(
  "/pre-register",
  ValidationMiddleware(PreRegisterDto),
  authController.preRegister.bind(authController),
);

router.get("/refresh", authController.refresh.bind(authController));

export default router;
