import { AuthGuard } from "../../shared/guards/auth.guard";
import { DataSourceConfig } from "../../shared/infrastructure/config/datasource.config";
import { JwtService } from "../jwt/jwt.service";
import { AuthController } from "./auth.controller";
import dotenv from "dotenv";

import { LoginRepository } from "../../shared/database/repositories/auth/login/login.repository";
import { UsuarioRepository } from "../../shared/database/repositories/core/usuario/usuario.repository";
import { PersonaRepository } from "../../shared/database/repositories/core/persona/persona.repository";
import { LoginUsuarioRequestRepository } from "../../shared/database/repositories/requests/login-usuario/login-usuario-repository";
import { RegistrarUsuarioRequestRepository } from "../../shared/database/repositories/requests/registrar-usuario/registrar-usuario-repository";
import { UsuarioRefreshTokenRepository } from "../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository";

import { RedisService } from "../../shared/infrastructure/cache/redis.service";
import { TokenManagerService } from "./application/services/token-manager.service";

import { LoginUseCase } from "./application/use-cases/login/login.use-case";
import { RegisterUseCase } from "./application/use-cases/register/register.use-case";
import { PreRegisterUseCase } from "./application/use-cases/pre-register/pre-register.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token/refresh-token.use.case";
import { AuditoriaRepository } from "../../shared/database/mongodb/repositories/auditoria.repository";

dotenv.config();

// const accessJwtService = new JwtService(process.env.JWT_ACCESS_SECRET!, "15m");
// const refreshJwtService = new JwtService(process.env.JWT_REFRESH_SECRET!, "7d");

const rsaAccessTokenService = new JwtService(
  process.env.JWT_PRIVATE_KEY!,
  process.env.JWT_ACCESS_EXPIRES_IN || "1h",
  "RS256"
);

const rsaRefreshTokenService = new JwtService(
  process.env.JWT_PRIVATE_KEY!,
  process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  "RS256"
);

const rsaVerificationService = new JwtService(
  process.env.JWT_PUBLIC_KEY!,
  "",
  "RS256"
);

const usuarioRepo = new UsuarioRepository(DataSourceConfig);
const loginRepo = new LoginRepository(DataSourceConfig);
const personaRepo = new PersonaRepository(DataSourceConfig);
const loginUsuarioRepo = new LoginUsuarioRequestRepository(DataSourceConfig);
const registrarUsuarioRepo = new RegistrarUsuarioRequestRepository(DataSourceConfig);
const usuarioRefreshTokenRepo = new UsuarioRefreshTokenRepository(DataSourceConfig);
const redisService = new RedisService();
const auditoriaRepository = new AuditoriaRepository();

const tokenManagerService = new TokenManagerService(
  rsaAccessTokenService,
  rsaRefreshTokenService
);

const loginUseCase = new LoginUseCase(
  DataSourceConfig,
  tokenManagerService,
  usuarioRepo,
  loginRepo,
  loginUsuarioRepo,
  usuarioRefreshTokenRepo,
  redisService,
  auditoriaRepository
);

const registerUseCase = new RegisterUseCase(
  DataSourceConfig,
  usuarioRepo,
  loginRepo,
  personaRepo,
  registrarUsuarioRepo,
  redisService,
  auditoriaRepository
);



const preRegisterUseCase = new PreRegisterUseCase(
  loginRepo
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  DataSourceConfig,
  tokenManagerService,
  usuarioRepo,
  usuarioRefreshTokenRepo,
  rsaAccessTokenService,
  rsaRefreshTokenService,

);



const authController = new AuthController(
  loginUseCase,
  registerUseCase,
  preRegisterUseCase,
  refreshTokenUseCase
);

const authGuard = new AuthGuard(rsaVerificationService);

export { authController, authGuard };