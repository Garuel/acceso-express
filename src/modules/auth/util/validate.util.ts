import { PersonaRepository } from "../../../shared/database/repositories/core/persona/persona.repository";
import { UsuarioRepository } from "../../../shared/database/repositories/core/usuario/usuario.repository";
import { CustomError } from "../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../shared/domain/enum/custom-error.enum";
import { RegisterDto } from "../dto/register.dto";
import { logger } from "../../../shared/infrastructure/utils/logger.util";
import { UsuarioEntity } from "../../../shared/database/entities/core/usuario.entity";
import { ValidateResult } from "../../../shared/domain/interfaces/validate-result.interface";
import { EstadoUsuarioEnum } from "../../../shared/domain/enum/estado-usuario.enum";
import { UsuarioRefreshTokenEntity } from "../../../shared/database/entities/core/usuario-refresh-token.entity";
import { TIEMPO_GRACIA_SEGUNDOS } from "../constants/tiempo-max-gracia-token-refresh.constat";
import { BuildUtil } from "../../../shared/infrastructure/utils/build.util";
import { UsuarioRefreshTokenRepository } from "../../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository";
import { JwtService } from "../../jwt/jwt.service";
import { ValidateTiempoGraciaInterface } from "../interface/validate-tiempo-gracia.interface";

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

  export async function validarTiempoDeGracia(
    usuarioRefreshTokenEntity: UsuarioRefreshTokenEntity,
    usuarioRepository: UsuarioRepository,
    usuarioRefreshTokenRepository: UsuarioRefreshTokenRepository,
    accessJwtService: JwtService,
    idUsuario: number,
  ): Promise<ValidateTiempoGraciaInterface> {
    if (usuarioRefreshTokenEntity.fechaUso !== null) {
      const segundosDesdeElPrimerUso =
        (new Date().getTime() - usuarioRefreshTokenEntity.fechaUso.getTime()) /
        1000;

      if (segundosDesdeElPrimerUso <= TIEMPO_GRACIA_SEGUNDOS) {
        logger.warn(
          `Petición concurrente detectada (${segundosDesdeElPrimerUso}s). Retornando token existente.`,
        );

        const usuario = await usuarioRepository.getUsuarioPorId(idUsuario);
        const usuarioInfoToken = BuildUtil.buildUsuarioInfoToken(usuario!);
        const accessToken = accessJwtService.sign(usuarioInfoToken);

        return {
          esConcurrente: true,
          tokens: {
            accessToken,
            refreshToken: usuarioRefreshTokenEntity.refreshToken,
          },
        };
      }

      logger.error(
        `ALERTA DE SEGURIDAD: Intento de reutilización de Refresh Token para el usuario ${idUsuario}`,
      );
      await usuarioRefreshTokenRepository.eliminarTodosLosTokensDelUsuario(
        idUsuario,
      );

      throw new CustomError({
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "Brecha de seguridad detectada. Inicie sesión nuevamente.",
      });
    }

    return {
      esConcurrente: false,
    };
  }
}
