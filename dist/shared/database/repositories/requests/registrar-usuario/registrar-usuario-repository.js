"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarUsuarioRequestRepository = void 0;
const registrar_usuario_entity_1 = require("../../../entities/requests/registrar-usuario.entity");
const request_idempotencia_repository_1 = require("../request-idempotencia.repository");
class RegistrarUsuarioRequestRepository extends request_idempotencia_repository_1.RequestIdempotenciaRepository {
    constructor(connection) {
        super(registrar_usuario_entity_1.RegistrarUsuarioRequestEntity, connection);
    }
}
exports.RegistrarUsuarioRequestRepository = RegistrarUsuarioRequestRepository;
