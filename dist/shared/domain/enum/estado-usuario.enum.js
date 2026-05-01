"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoUsuarioEnum = void 0;
var EstadoUsuarioEnum;
(function (EstadoUsuarioEnum) {
    EstadoUsuarioEnum[EstadoUsuarioEnum["Activo"] = 1] = "Activo";
    EstadoUsuarioEnum[EstadoUsuarioEnum["BloqueadoTemporalmente"] = 2] = "BloqueadoTemporalmente";
    EstadoUsuarioEnum[EstadoUsuarioEnum["BloqueadoIndefinidamente"] = 3] = "BloqueadoIndefinidamente";
    EstadoUsuarioEnum[EstadoUsuarioEnum["Deshabilitado"] = 4] = "Deshabilitado";
})(EstadoUsuarioEnum || (exports.EstadoUsuarioEnum = EstadoUsuarioEnum = {}));
