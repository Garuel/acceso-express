"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const custom_error_enum_1 = require("../../shared/domain/enum/custom-error.enum");
const tipo_alerta_enum_1 = require("../../shared/domain/enum/tipo-alerta.enum");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res, next) {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers["user-agent"];
            const result = await this.authService.login({
                ...req.body,
                ip: ipAddress,
                userAgent: userAgent,
            });
            res.status(custom_error_enum_1.HttpStatusCode.OK).json({
                message: "Login exitoso",
                tipoRespuesta: tipo_alerta_enum_1.TipoRespuestaEnum.Success,
                title: "Login",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const result = await this.authService.register(req.body);
            res.status(custom_error_enum_1.HttpStatusCode.CREATED).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async preRegister(req, res, next) {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers["user-agent"];
            const { username } = req.body;
            const plainKey = await this.authService.preRegister(username, ipAddress || "", userAgent || "");
            return res.status(custom_error_enum_1.HttpStatusCode.OK).json({
                message: "Pre register exitoso",
                tipoRespuesta: tipo_alerta_enum_1.TipoRespuestaEnum.Success,
                title: "Pre Register",
                data: plainKey,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
