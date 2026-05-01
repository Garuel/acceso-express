import { PersonaRepository } from "../../../shared/database/repositories/core/persona/persona.repository";
import { UsuarioRepository } from "../../../shared/database/repositories/core/usuario/usuario.repository";
import { CustomError } from "../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../shared/domain/enum/custom-error.enum";
import { RegisterDto } from "../dto/register.dto";
import { logger } from "../../../shared/infrastructure/utils/logger.util";
import { UsuarioEntity } from "../../../shared/database/entities/core/usuario.entity";
import { ValidateResult } from "../../../shared/domain/interfaces/validate-result.interface";
import { EstadoUsuarioEnum } from "../../../shared/domain/enum/estado-usuario.enum";

export namespace ValidateUtil {
  export function validateEstadoUsuario(idEstado: number): ValidateResult {
    if (idEstado === EstadoUsuarioEnum.BloqueadoTemporalmente) {
      logger.error("El usuario está bloqueado temporalmente");

      throw new CustomError({
        statusCode: HttpStatusCode.CONFLICT,
        message: "El usuario está bloqueado temporalmente",
      });
    }
    if (idEstado === EstadoUsuarioEnum.BloqueadoIndefinidamente) {
      logger.error("El usuario está bloqueado indefinidamente");
      throw new CustomError({
        statusCode: HttpStatusCode.CONFLICT,
        message: "El usuario está bloqueado indefinidamente",
      });
    }
    if (idEstado === EstadoUsuarioEnum.Deshabilitado) {
      logger.error("El usuario está deshabilitado");
      throw new CustomError({
        statusCode: HttpStatusCode.CONFLICT,
        message: "El usuario está deshabilitado",
      });
    }

    logger.info("El usuario es válido");
    return { esValido: true };
  }

  export function validarExistenciaUsuario(
    usuario: UsuarioEntity | null | undefined,
  ): ValidateResult {
    if (!usuario) {
      logger.error("El usuario no está registrado");

      throw new CustomError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "El usuario no está registrado",
      });
    }

    logger.info("El usuario existe");
    return { esValido: true };
  }

  export async function existeUsuarioARegistrar(
    usuarioRepository: UsuarioRepository,
    personaRepository: PersonaRepository,
    request: RegisterDto,
  ): Promise<ValidateResult> {
    logger.info("Verificando si existe usuario");
    const existingUser = await usuarioRepository.existeUsuario(
      request.username,
    );
    logger.info("Usuario existe");

    if (existingUser) {
      throw new CustomError({
        message: "El usuario ya existe en el sistema",
        statusCode: HttpStatusCode.BAD_REQUEST,
        titulo: "Registro - usuario existente",
      });
    }

    logger.info("Verificando si existe persona por numero de documento");
    const existingPersonByDocument =
      await personaRepository.existePersonaPorNumeroDocumento(
        request.numeroDocumento,
      );

    if (existingPersonByDocument) {
      logger.info("Persona existe por numero de documento");
      throw new CustomError({
        message: "La persona ya existe en el sistema",
        statusCode: HttpStatusCode.BAD_REQUEST,
        titulo: "Registro - persona existente",
      });
    }

    return { esValido: true };
  }
}
