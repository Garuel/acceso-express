import { NextFunction, Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { HttpStatusCode } from "../../shared/domain/enum/custom-error.enum";
import { TipoRespuestaEnum } from "../../shared/domain/enum/tipo-alerta.enum";
import { UsuarioInfoToken } from "../auth/dto/login.dto";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  public async uploadProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = (req as any).user as UsuarioInfoToken;
      const userId = user?.id;
      const file = req.file;

      const result = await this.profileService.uploadProfilePicture({
        idUsuario: userId,
        file: file!,
      });

      res.status(HttpStatusCode.OK).json({
        message: "Imagen de perfil subida exitosamente",
        tipoRespuesta: TipoRespuestaEnum.Success,
        title: "Imagen de perfil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
