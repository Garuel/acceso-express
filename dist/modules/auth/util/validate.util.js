"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUtil = void 0;
const custom_error_class_1 = require("../../../shared/domain/classes/custom-error.class");
const custom_error_enum_1 = require("../../../shared/domain/enum/custom-error.enum");
const logger_util_1 = require("../../../shared/infrastructure/utils/logger.util");
const estado_usuario_enum_1 = require("../../../shared/domain/enum/estado-usuario.enum");
const tiempo_max_gracia_token_refresh_constat_1 = require("../constants/tiempo-max-gracia-token-refresh.constat");
const build_util_1 = require("../../../shared/infrastructure/utils/build.util");
var ValidateUtil;
(function (ValidateUtil) {
    function validateEstadoUsuario(idEstado) {
        if (idEstado === estado_usuario_enum_1.EstadoUsuarioEnum.BloqueadoTemporalmente) {
            logger_util_1.logger.error("El usuario está bloqueado temporalmente");
            throw new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                message: "El usuario está bloqueado temporalmente",
            });
        }
        if (idEstado === estado_usuario_enum_1.EstadoUsuarioEnum.BloqueadoIndefinidamente) {
            logger_util_1.logger.error("El usuario está bloqueado indefinidamente");
            throw new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                message: "El usuario está bloqueado indefinidamente",
            });
        }
        if (idEstado === estado_usuario_enum_1.EstadoUsuarioEnum.Deshabilitado) {
            logger_util_1.logger.error("El usuario está deshabilitado");
            throw new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                message: "El usuario está deshabilitado",
            });
        }
        logger_util_1.logger.info("El usuario es válido");
        return { esValido: true };
    }
    ValidateUtil.validateEstadoUsuario = validateEstadoUsuario;
    function validarExistenciaUsuario(usuario) {
        if (!usuario) {
            logger_util_1.logger.error("El usuario no está registrado");
            throw new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.NOT_FOUND,
                message: "El usuario no está registrado",
            });
        }
        logger_util_1.logger.info("El usuario existe");
        return { esValido: true };
    }
    ValidateUtil.validarExistenciaUsuario = validarExistenciaUsuario;
    async function existeUsuarioARegistrar(usuarioRepository, personaRepository, request) {
        logger_util_1.logger.info("Verificando si existe usuario");
        const existingUser = await usuarioRepository.existeUsuario(request.username);
        logger_util_1.logger.info("Usuario existe");
        if (existingUser) {
            throw new custom_error_class_1.CustomError({
                message: "El usuario ya existe en el sistema",
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                titulo: "Registro - usuario existente",
            });
        }
        logger_util_1.logger.info("Verificando si existe persona por numero de documento");
        const existingPersonByDocument = await personaRepository.existePersonaPorNumeroDocumento(request.numeroDocumento);
        if (existingPersonByDocument) {
            logger_util_1.logger.info("Persona existe por numero de documento");
            throw new custom_error_class_1.CustomError({
                message: "La persona ya existe en el sistema",
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                titulo: "Registro - persona existente",
            });
        }
        return { esValido: true };
    }
    ValidateUtil.existeUsuarioARegistrar = existeUsuarioARegistrar;
    async function validarTiempoDeGracia(usuarioRefreshTokenEntity, usuarioRepository, usuarioRefreshTokenRepository, accessJwtService, idUsuario) {
        if (usuarioRefreshTokenEntity.fechaUso !== null) {
            const segundosDesdeElPrimerUso = (new Date().getTime() - usuarioRefreshTokenEntity.fechaUso.getTime()) /
                1000;
            if (segundosDesdeElPrimerUso <= tiempo_max_gracia_token_refresh_constat_1.TIEMPO_GRACIA_SEGUNDOS) {
                logger_util_1.logger.warn(`Petición concurrente detectada (${segundosDesdeElPrimerUso}s). Retornando token existente.`);
                const usuario = await usuarioRepository.getUsuarioPorId(idUsuario);
                const usuarioInfoToken = build_util_1.BuildUtil.buildUsuarioInfoToken(usuario);
                const accessToken = accessJwtService.sign(usuarioInfoToken);
                return {
                    esConcurrente: true,
                    tokens: {
                        accessToken,
                        refreshToken: usuarioRefreshTokenEntity.refreshToken,
                    },
                };
            }
            logger_util_1.logger.error(`ALERTA DE SEGURIDAD: Intento de reutilización de Refresh Token para el usuario ${idUsuario}`);
            await usuarioRefreshTokenRepository.eliminarTodosLosTokensDelUsuario(idUsuario);
            throw new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.UNAUTHORIZED,
                message: "Brecha de seguridad detectada. Inicie sesión nuevamente.",
            });
        }
        return {
            esConcurrente: false,
        };
    }
    ValidateUtil.validarTiempoDeGracia = validarTiempoDeGracia;
})(ValidateUtil || (exports.ValidateUtil = ValidateUtil = {}));
