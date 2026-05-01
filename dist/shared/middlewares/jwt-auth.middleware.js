"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JtwAuthMiddleware = void 0;
const custom_error_class_1 = require("../domain/classes/custom-error.class");
const custom_error_enum_1 = require("../domain/enum/custom-error.enum");
const JtwAuthMiddleware = (authGuard) => async (req, res, next) => {
    const isAuthorized = await authGuard.canActivate(req);
    if (!isAuthorized) {
        throw new custom_error_class_1.CustomError({
            statusCode: custom_error_enum_1.HttpStatusCode.UNAUTHORIZED,
            message: "No autorizado",
            titulo: "Unauthorized",
        });
    }
    next();
};
exports.JtwAuthMiddleware = JtwAuthMiddleware;
