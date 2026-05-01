"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const custom_error_class_1 = require("../domain/classes/custom-error.class");
const tipo_alerta_enum_1 = require("../domain/enum/tipo-alerta.enum");
const custom_error_enum_1 = require("../domain/enum/custom-error.enum");
const ValidationMiddleware = (dtoClass) => {
    return async (req, res, next) => {
        console.log("REQUEST: ", req.body);
        const dtoInstance = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        if (errors.length > 0) {
            const message = errors
                .map((e) => Object.values(e.constraints || {}))
                .join(", ");
            return next(new custom_error_class_1.CustomError({
                message,
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                tipoRespuesta: tipo_alerta_enum_1.TipoRespuestaEnum.Error,
            }));
        }
        req.body = dtoInstance;
        next();
    };
};
exports.ValidationMiddleware = ValidationMiddleware;
