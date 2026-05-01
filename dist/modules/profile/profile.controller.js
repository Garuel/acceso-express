"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const custom_error_enum_1 = require("../../shared/domain/enum/custom-error.enum");
const tipo_alerta_enum_1 = require("../../shared/domain/enum/tipo-alerta.enum");
class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async uploadProfilePicture(req, res, next) {
        try {
            const user = req.user;
            const userId = user?.id;
            const file = req.file;
            const result = await this.profileService.uploadProfilePicture({
                idUsuario: userId,
                file: file,
            });
            res.status(custom_error_enum_1.HttpStatusCode.OK).json({
                message: "Imagen de perfil subida exitosamente",
                tipoRespuesta: tipo_alerta_enum_1.TipoRespuestaEnum.Success,
                title: "Imagen de perfil",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProfileController = ProfileController;
