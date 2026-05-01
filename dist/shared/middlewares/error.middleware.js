"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const custom_error_class_1 = require("../domain/classes/custom-error.class");
const custom_error_enum_1 = require("../domain/enum/custom-error.enum");
const globalErrorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR en ${req.method} ${req.originalUrl}`);
    console.error(err);
    if (err instanceof custom_error_class_1.CustomError) {
        const errorData = err.toJSON();
        const clientMessage = errorData.statusCode >= 500
            ? "Algo salió mal, inténtalo más tarde"
            : errorData.message;
        return res.status(errorData.statusCode).json({
            ...errorData,
            message: clientMessage,
            contexto: `${req.method} ${req.originalUrl}`,
        });
    }
    return res.status(custom_error_enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        statusCode: custom_error_enum_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        titulo: "Error Inesperado",
        fecha: new Date().toISOString(),
    });
};
exports.globalErrorHandler = globalErrorHandler;
