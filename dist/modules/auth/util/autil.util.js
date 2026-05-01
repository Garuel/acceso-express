"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtil = void 0;
const custom_error_class_1 = require("../../../shared/domain/classes/custom-error.class");
const custom_error_enum_1 = require("../../../shared/domain/enum/custom-error.enum");
const encrypt_util_1 = require("../../../shared/infrastructure/utils/encrypt.util");
const logger_util_1 = require("../../../shared/infrastructure/utils/logger.util");
var AuthUtil;
(function (AuthUtil) {
    async function obtenerPassword(loginRepository, username, password, seElimina = true) {
        logger_util_1.logger.info("Obteniendo login por username");
        const login = await loginRepository.obtenerPorUsername(username);
        if (!login) {
            throw new custom_error_class_1.CustomError({
                message: "No se encontro usuario con ese username en login",
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                titulo: "Login - usuario no encontrado",
            });
        }
        logger_util_1.logger.info("Verificando si se elimina login");
        if (seElimina)
            await loginRepository.eliminarPorUsername(username);
        const passwordDecrypted = encrypt_util_1.EncryptUtil.decryptBase64(password, login.confirmPassword);
        if (!passwordDecrypted || passwordDecrypted.trim().length === 0) {
            logger_util_1.logger.error("El passwordDecrypted está dañado");
            throw new custom_error_class_1.CustomError({
                message: "La contraseña no es correcta",
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                titulo: "Login - contraseña incorrecta",
            });
        }
        return [login.confirmPassword, passwordDecrypted];
    }
    AuthUtil.obtenerPassword = obtenerPassword;
})(AuthUtil || (exports.AuthUtil = AuthUtil = {}));
