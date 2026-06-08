"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const persona_repository_1 = require("../../shared/database/repositories/core/persona/persona.repository");
const custom_error_enum_1 = require("../../shared/domain/enum/custom-error.enum");
const tipo_alerta_enum_1 = require("../../shared/domain/enum/tipo-alerta.enum");
const custom_error_class_1 = require("../../shared/domain/classes/custom-error.class");
class ProfileService {
    dataSource;
    storageService;
    personaRepository;
    constructor(dataSource, storageService) {
        this.dataSource = dataSource;
        this.storageService = storageService;
        this.personaRepository = new persona_repository_1.PersonaRepository(dataSource);
    }
    async uploadProfilePicture(req) {
        const url = await this.storageService.upload(req.file, "profiles");
        if (!url || url.length === 0) {
            throw new custom_error_class_1.CustomError({
                message: "No se pudo obtener url de la imagen de perfil",
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                tipoRespuesta: tipo_alerta_enum_1.TipoRespuestaEnum.Error,
            });
        }
        await this.personaRepository.update(req.idUsuario, {
            urlProfilePicture: url,
        });
        return { url };
    }
}
exports.ProfileService = ProfileService;
