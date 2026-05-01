import { LoginRepository } from "../../../shared/database/repositories/auth/login/login.repository";
import { CustomError } from "../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../shared/domain/enum/custom-error.enum";
import { EncryptUtil } from "../../../shared/infrastructure/utils/encrypt.util";
import { logger } from "../../../shared/infrastructure/utils/logger.util";

export namespace AuthUtil {
  export async function obtenerPassword(
    loginRepository: LoginRepository,
    username: string,
    password: string,
    seElimina: boolean = true,
  ): Promise<[string, string]> {
    logger.info("Obteniendo login por username");
    const login = await loginRepository.obtenerPorUsername(username);

    if (!login) {
      throw new CustomError({
        message: "No se encontro usuario con ese username en login",
        statusCode: HttpStatusCode.BAD_REQUEST,
        titulo: "Login - usuario no encontrado",
      });
    }

    logger.info("Verificando si se elimina login");
    if (seElimina) await loginRepository.eliminarPorUsername(username);

    const passwordDecrypted = EncryptUtil.decryptBase64(
      password,
      login.confirmPassword!,
    );

    if (!passwordDecrypted || passwordDecrypted.trim().length === 0) {
      logger.error("El passwordDecrypted está dañado");
      throw new CustomError({
        message: "La contraseña no es correcta",
        statusCode: HttpStatusCode.BAD_REQUEST,
        titulo: "Login - contraseña incorrecta",
      });
    }

    return [login.confirmPassword!, passwordDecrypted];
  }
}
