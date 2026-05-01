"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const tipo_alerta_enum_1 = require("../enum/tipo-alerta.enum");
class CustomError extends Error {
    data;
    constructor(data) {
        super(data.message);
        this.data = data;
        Object.setPrototypeOf(this, new.target.prototype);
        //  verificar si usa Node.js/V8
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, new.target);
        }
        else {
            this.stack = new Error(data.message).stack;
        }
    }
    toJSON() {
        return {
            ...this.data,
            fecha: this.data.fecha ?? new Date().toISOString(),
            tipoRespuesta: this.data.tipoRespuesta ?? tipo_alerta_enum_1.TipoRespuestaEnum.Error,
            titulo: this.data.titulo ?? "Error",
        };
    }
}
exports.CustomError = CustomError;
