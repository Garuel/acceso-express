import { UsuarioInfoToken } from "../../../modules/auth/dto/login.dto";
import { UsuarioEntity } from "../../database/entities/core/usuario.entity";

export namespace BuildUtil {
  /**
   * Genera un número entero entre el dominio [min, max]
   * @param min Cota inferior
   * @param max Cota superior
   * @returns random entero
   */
  export function buildRandomEnRango(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  export function buildUsuarioInfoToken(
    usuario: UsuarioEntity,
  ): UsuarioInfoToken {
    return {
      id: usuario.id,
      username: usuario.username,
      idEstado: usuario.idEstado,
      publicKey: usuario.publicKey!,
      email: usuario.persona.email,
      nombres: usuario.persona.nombres,
      apellidoPaterno: usuario.persona.apellidoPaterno,
      apellidoMaterno: usuario.persona.apellidoMaterno,
      numeroDocumento: usuario.persona.numeroDocumento,
      idTipoDocumento: usuario.persona.idTipoDocumento,
      nombreTipoDocumento: usuario.persona.tipoDocumento.nombre,
    };
  }
}
