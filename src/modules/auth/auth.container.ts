import { AuthGuard } from "../../shared/guards/auth.guard";
import { DataSourceConfig } from "../../shared/infrastructure/config/datasource.config";
import { JwtService } from "../jwt/jwt.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import dotenv from "dotenv";
import { LoginRepository } from "../../shared/database/repositories/auth/login/login.repository";
import { UsuarioRepository } from "../../shared/database/repositories/core/usuario/usuario.repository";
import { PersonaRepository } from "../../shared/database/repositories/core/persona/persona.repository";
import { LoginUsuarioRequestRepository } from "../../shared/database/repositories/requests/login-usuario/login-usuario-repository";
import { RegistrarUsuarioRequestRepository } from "../../shared/database/repositories/requests/registrar-usuario/registrar-usuario-repository";
import { UsuarioRefreshTokenRepository } from "../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository";

dotenv.config();

const accessJwtService = new JwtService(process.env.JWT_ACCESS_SECRET!, "15m");
const refreshJwtService = new JwtService(process.env.JWT_REFRESH_SECRET!, "7d");


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
const registrarUsuarioRepo = new RegistrarUsuarioRequestRepository(
  DataSourceConfig,
);
const usuarioRefreshTokenRepo = new UsuarioRefreshTokenRepository(
  DataSourceConfig,
);

const authService = new AuthService(
  DataSourceConfig,
  rsaAccessTokenService,
  rsaRefreshTokenService,
  usuarioRepo,
  loginRepo,
  personaRepo,
  loginUsuarioRepo,
  registrarUsuarioRepo,
  usuarioRefreshTokenRepo,
);

const authController = new AuthController(authService);

const authGuard = new AuthGuard(rsaVerificationService);

export { authController, authGuard };
