"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const custom_error_enum_1 = require("../../shared/domain/enum/custom-error.enum");
const tipo_alerta_enum_1 = require("../../shared/domain/enum/tipo-alerta.enum");
const cookie_max_age_constant_1 = require("./constants/cookie-max-age.constant");
class AuthController {
    loginUseCase;
    registerUseCase;
    preRegisterUseCase;
    refreshTokenUseCase;
    constructor(loginUseCase, registerUseCase, preRegisterUseCase, refreshTokenUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.preRegisterUseCase = preRegisterUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }
    async login(req, res, next) {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers["user-agent"];
            const result = await this.loginUseCase.execute({
                ...req.body,
                ip: ipAddress,
                userAgent: userAgent,
            });
            const refreshToken = result.data?.refreshToken;
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: cookie_max_age_constant_1.COOKIE_MAX_AGE,
            });
            res.status(custom_error_enum_1.HttpStatusCode.OK).json({
                message: "Login exitoso",
                tipoRespuesta: tipo_alerta_enum_1.TipoRespuestaEnum.Success,
                title: "Login",
                data: result.data?.accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const result = await this.registerUseCase.execute(req.body);
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
            const plainKey = await this.preRegisterUseCase.execute(username, ipAddress || "", userAgent || "");
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
    async refresh(req, res) {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res.status(401).json({ message: "No hay token de refresco" });
        }
        const result = await this.refreshTokenUseCase.execute(oldRefreshToken);
        res.cookie("refreshToken", result.data?.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: cookie_max_age_constant_1.COOKIE_MAX_AGE,
        });
        return res.status(200).json({
            statusCode: 200,
            message: "Token renovado",
            data: { accessToken: result.data?.accessToken },
        });
    }
}
exports.AuthController = AuthController;
