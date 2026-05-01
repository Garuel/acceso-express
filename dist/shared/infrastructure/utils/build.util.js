"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildUtil = void 0;
var BuildUtil;
(function (BuildUtil) {
    /**
     * Genera un número entero entre el dominio [min, max]
     * @param min Cota inferior
     * @param max Cota superior
     * @returns random entero
     */
    function buildRandomEnRango(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    BuildUtil.buildRandomEnRango = buildRandomEnRango;
    function buildUsuarioInfoToken(usuario) {
        return {
            id: usuario.id,
            username: usuario.username,
            idEstado: usuario.idEstado,
            publicKey: usuario.publicKey,
            email: usuario.persona.email,
            nombres: usuario.persona.nombres,
            apellidoPaterno: usuario.persona.apellidoPaterno,
            apellidoMaterno: usuario.persona.apellidoMaterno,
            numeroDocumento: usuario.persona.numeroDocumento,
            idTipoDocumento: usuario.persona.idTipoDocumento,
            nombreTipoDocumento: usuario.persona.tipoDocumento.nombre,
        };
    }
    BuildUtil.buildUsuarioInfoToken = buildUsuarioInfoToken;
})(BuildUtil || (exports.BuildUtil = BuildUtil = {}));
