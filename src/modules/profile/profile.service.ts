import { DataSource } from "typeorm";
import { PersonaRepository } from "../../shared/database/repositories/core/persona/persona.repository";
import { IStorageService } from "../../shared/domain/interfaces/storage.interface";
import { UploadProfilePictureDto } from "./dto/upload-profile-picture.dto";
import { HttpStatusCode } from "../../shared/domain/enum/custom-error.enum";
import { TipoRespuestaEnum } from "../../shared/domain/enum/tipo-alerta.enum";
import { CustomError } from "../../shared/domain/classes/custom-error.class";

export class ProfileService {
  private readonly personaRepository: PersonaRepository;

  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: IStorageService,
  ) {
    this.personaRepository = new PersonaRepository(dataSource);
  }

  public async uploadProfilePicture(req: UploadProfilePictureDto) {
    const url = await this.storageService.upload(req.file, "profiles");

    if (!url || url.length === 0) {
      throw new CustomError({
        message: "No se pudo obtener url de la imagen de perfil",
        statusCode: HttpStatusCode.BAD_REQUEST,
        tipoRespuesta: TipoRespuestaEnum.Error,
      });
    }

    await this.personaRepository.update(req.idUsuario, {
      urlProfilePicture: url,
    });

    return { url };
  }
}
