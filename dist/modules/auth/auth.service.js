"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = require("bcrypt");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const crypto_1 = require("crypto");
const login_repository_1 = require("../../shared/database/repositories/auth/login/login.repository");
const persona_repository_1 = require("../../shared/database/repositories/core/persona/persona.repository");
const usuario_repository_1 = require("../../shared/database/repositories/core/usuario/usuario.repository");
const registrar_usuario_repository_1 = require("../../shared/database/repositories/requests/registrar-usuario/registrar-usuario-repository");
const custom_error_class_1 = require("../../shared/domain/classes/custom-error.class");
const custom_error_enum_1 = require("../../shared/domain/enum/custom-error.enum");
const estado_usuario_enum_1 = require("../../shared/domain/enum/estado-usuario.enum");
const build_util_1 = require("../../shared/infrastructure/utils/build.util");
const logger_util_1 = require("../../shared/infrastructure/utils/logger.util");
const jwt_service_1 = require("../jwt/jwt.service");
const autil_util_1 = require("./util/autil.util");
const validate_util_1 = require("./util/validate.util");
const login_usuario_repository_1 = require("../../shared/database/repositories/requests/login-usuario/login-usuario-repository");
const tsyringe_1 = require("tsyringe");
const usuario_refresh_token_repository_1 = require("../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository");
const date_util_1 = require("../../shared/infrastructure/utils/date.util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let AuthService = class AuthService {
    dataSource;
    accessJwtService;
    refreshJwtService;
    usuarioRepoInyectado;
    loginRepoInyectado;
    personaRepoInyectado;
    loginUsuarioRepoInyectado;
    registrarUsuarioRepoInyectado;
    usuarioRefreshTokenRepositoryInyectado;
    constructor(dataSource, accessJwtService, refreshJwtService, usuarioRepoInyectado, loginRepoInyectado, personaRepoInyectado, loginUsuarioRepoInyectado, registrarUsuarioRepoInyectado, usuarioRefreshTokenRepositoryInyectado) {
        this.dataSource = dataSource;
        this.accessJwtService = accessJwtService;
        this.refreshJwtService = refreshJwtService;
        this.usuarioRepoInyectado = usuarioRepoInyectado;
        this.loginRepoInyectado = loginRepoInyectado;
        this.personaRepoInyectado = personaRepoInyectado;
        this.loginUsuarioRepoInyectado = loginUsuarioRepoInyectado;
        this.registrarUsuarioRepoInyectado = registrarUsuarioRepoInyectado;
        this.usuarioRefreshTokenRepositoryInyectado = usuarioRefreshTokenRepositoryInyectado;
    }
    async login(request) {
        const loginResponse = await this.dataSource.transaction(async (manager) => {
            const usuarioRepository = this.usuarioRepoInyectado.setTransactionManager(manager);
            const loginRepository = this.loginRepoInyectado.setTransactionManager(manager);
            const loginUsuarioRepository = this.loginUsuarioRepoInyectado.setTransactionManager(manager);
            const usuarioRefreshTokenRepository = this.usuarioRefreshTokenRepositoryInyectado.setTransactionManager(manager);
            if (await loginUsuarioRepository.existe(request.rqUUID)) {
                throw new custom_error_class_1.CustomError({
                    statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                    titulo: "Petición ya atendida",
                    message: "La petición ya fue atendida, recargue la página",
                });
            }
            logger_util_1.logger.info("Obteniendo data password...");
            const dataPassword = await autil_util_1.AuthUtil.obtenerPassword(loginRepository, request.username, request.password);
            logger_util_1.logger.info("Data password obtenido");
            logger_util_1.logger.info("Obteniendo usuario...");
            const usuario = await usuarioRepository.getUsuarioPorUsername(request.username);
            logger_util_1.logger.info("Usuario obtenido");
            validate_util_1.ValidateUtil.validarExistenciaUsuario(usuario);
            validate_util_1.ValidateUtil.validateEstadoUsuario(usuario.idEstado);
            const matchesPassword = await (0, bcrypt_1.compare)(dataPassword[1], usuario.password);
            if (!matchesPassword) {
                throw new custom_error_class_1.CustomError({
                    statusCode: custom_error_enum_1.HttpStatusCode.UNAUTHORIZED,
                    message: "Contraseña incorrecta",
                });
            }
            const codigo = build_util_1.BuildUtil.buildRandomEnRango(100000, 999999).toString();
            const usuarioInfoToken = build_util_1.BuildUtil.buildUsuarioInfoToken(usuario);
            const refreshInfo = {
                idUsuario: usuario.id,
                codigo,
            };
            const tokens = this.generateTokens(usuarioInfoToken, refreshInfo);
            logger_util_1.logger.info("Insertando rquuid...");
            await loginUsuarioRepository.insertar([
                { uuid: request.rqUUID, fecha: new Date() },
            ]);
            logger_util_1.logger.info("Rquuid insertado");
            await usuarioRefreshTokenRepository.create({
                idUsuario: usuario.id,
                codigo,
                refreshToken: tokens.refreshToken,
                fechaExpiracion: this.getRefreshTokenExpiration(),
            });
            return {
                message: "Login exitoso",
                data: {
                    tokens,
                },
            };
        });
        return loginResponse;
    }
    async register(request) {
        logger_util_1.logger.verbose("=====REGISTER=====");
        const response = await this.dataSource.transaction(async (manager) => {
            const usuarioRepository = this.usuarioRepoInyectado.setTransactionManager(manager);
            const personaRepository = this.personaRepoInyectado.setTransactionManager(manager);
            const loginRepository = this.loginRepoInyectado.setTransactionManager(manager);
            const registrarUsuarioRepository = this.registrarUsuarioRepoInyectado.setTransactionManager(manager);
            if (await registrarUsuarioRepository.existe(request.rqUUID)) {
                throw new custom_error_class_1.CustomError({
                    statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                    titulo: "Petición ya atendida",
                    message: "La petición ya fue atendida, recargue la página",
                });
            }
            await validate_util_1.ValidateUtil.existeUsuarioARegistrar(usuarioRepository, personaRepository, request);
            let password;
            logger_util_1.logger.info("Obteniendo data password...");
            const passwordDecryptedData = await autil_util_1.AuthUtil.obtenerPassword(loginRepository, request.username, request.password);
            logger_util_1.logger.info("data passsword decrypted obtenido");
            password = await (0, bcrypt_1.hash)(passwordDecryptedData[1], 10);
            logger_util_1.logger.info("creando persona...");
            const personaInsertado = await personaRepository.create({
                nombres: request.nombres,
                apellidoPaterno: request.apellidoPaterno,
                apellidoMaterno: request.apellidoMaterno,
                numeroDocumento: request.numeroDocumento,
                numeroTelefono: request.numeroTelefono,
                email: request.email,
                idTipoDocumento: request.idTipoDocumento,
            });
            logger_util_1.logger.info("persona creada");
            logger_util_1.logger.info("creando usuario...");
            const usuario = await usuarioRepository.create({
                username: request.username,
                password,
                idPersona: personaInsertado.id,
                idEstado: estado_usuario_enum_1.EstadoUsuarioEnum.Activo,
                intentosFallidos: 0,
                publicKey: (0, uuid_1.v4)(),
                fechaCreacion: new Date(),
                esActivo: true,
            });
            logger_util_1.logger.info("usuario creado");
            logger_util_1.logger.info("Insertando rquuid...");
            await registrarUsuarioRepository.insertar([
                { uuid: request.rqUUID, fecha: new Date() },
            ]);
            logger_util_1.logger.info("Rquuid insertado");
            return {
                message: "Usuario registrado correctamente",
                data: { usuario },
            };
        });
        return response;
    }
    async preRegister(username, ip, userAgent) {
        const loginRepository = new login_repository_1.LoginRepository(this.dataSource);
        //  llave aleatoria de 32 caracteres (16 IV + 16 Key)
        const plainKey = (0, crypto_1.randomBytes)(16).toString("hex");
        await loginRepository.eliminarPorUsername(username);
        await loginRepository.crear({
            username,
            confirmPassword: plainKey,
            fechaExpiracion: new Date(Date.now() + 300000),
            sessionToken: (0, uuid_1.v4)(),
            ipAddress: ip,
            userAgent: userAgent,
        });
        return plainKey;
    }
    async refresh(oldRefreshToken) {
        const response = await this.dataSource.transaction(async (manager) => {
            const usuarioRefreshTokenRepository = this.usuarioRefreshTokenRepositoryInyectado.setTransactionManager(manager);
            const usuarioRepository = this.usuarioRepoInyectado.setTransactionManager(manager);
            logger_util_1.logger.verbose("=====REFRESH=====");
            const decoded = this.refreshJwtService.verify(oldRefreshToken);
            logger_util_1.logger.info("Token decodificado correctamente");
            if (!decoded.codigo) {
                throw new custom_error_class_1.CustomError({
                    statusCode: custom_error_enum_1.HttpStatusCode.UNAUTHORIZED,
                    message: "Token inválido",
                });
            }
            logger_util_1.logger.info("Buscando token en BD");
            const tokenDb = await usuarioRefreshTokenRepository.obtenerPorToken(oldRefreshToken);
            logger_util_1.logger.info("Token encontrado en BD");
            if (!tokenDb || tokenDb.fechaExpiracion < new Date()) {
                throw new custom_error_class_1.CustomError({
                    statusCode: custom_error_enum_1.HttpStatusCode.UNAUTHORIZED,
                    message: "Sesión expirada o inválida",
                });
            }
            logger_util_1.logger.info("Borrando el anterior refresh token");
            await usuarioRefreshTokenRepository.eliminarPorId(tokenDb.id);
            logger_util_1.logger.info("Refresh token eliminado correctamente");
            logger_util_1.logger.info("Obteniendo usuario por id...");
            const usuario = await usuarioRepository.getUsuarioPorId(decoded.idUsuario);
            logger_util_1.logger.info("Usuario obtenido correctamente");
            logger_util_1.logger.info("Construyendo usuario info token...");
            const usuarioInfoToken = build_util_1.BuildUtil.buildUsuarioInfoToken(usuario);
            logger_util_1.logger.info("Usuario info token construido correctamente");
            const newAccessToken = this.accessJwtService.sign(usuarioInfoToken);
            logger_util_1.logger.info("Nuevo access token construido correctamente");
            const Nuevocodigo = build_util_1.BuildUtil.buildRandomEnRango(100000, 999999).toString();
            const tokens = this.generateTokens(usuarioInfoToken, {
                idUsuario: usuario.id,
                codigo: Nuevocodigo,
            });
            await usuarioRefreshTokenRepository.create({
                idUsuario: usuario.id,
                codigo: decoded.codigo,
                refreshToken: tokens.refreshToken,
                fechaExpiracion: this.getRefreshTokenExpiration(),
            });
            return {
                message: "Token renovado",
                data: { accessToken: newAccessToken },
            };
        });
        return response;
    }
    generateTokens(usuarioInfo, refreshInfo) {
        const accessToken = this.accessJwtService.sign(usuarioInfo);
        const refreshToken = this.refreshJwtService.sign(refreshInfo);
        return {
            accessToken,
            refreshToken,
        };
    }
    getRefreshTokenExpiration() {
        return date_util_1.DateUtil.addTimeToCurrentDate(process.env.JWT_REFRESH_EXPIRES_IN || "7d");
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        jwt_service_1.JwtService,
        jwt_service_1.JwtService,
        usuario_repository_1.UsuarioRepository,
        login_repository_1.LoginRepository,
        persona_repository_1.PersonaRepository,
        login_usuario_repository_1.LoginUsuarioRequestRepository,
        registrar_usuario_repository_1.RegistrarUsuarioRequestRepository,
        usuario_refresh_token_repository_1.UsuarioRefreshTokenRepository])
], AuthService);
