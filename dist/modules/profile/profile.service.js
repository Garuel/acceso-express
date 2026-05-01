"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const persona_repository_1 = require("../../shared/database/repositories/core/persona/persona.repository");
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
        console.log("URL: ", url);
        await this.personaRepository.update(req.idUsuario, {
            urlProfilePicture: url,
        });
        return { url };
    }
}
exports.ProfileService = ProfileService;
