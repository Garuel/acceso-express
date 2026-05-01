import { HttpStatusCode } from "../../../shared/domain/enum/custom-error.enum";
import { EncryptUtil } from "../../../shared/infrastructure/utils/encrypt.util";
import { AuthUtil } from "./autil.util";

describe("AuthUtil", () => {
  // 1. Definimos los mocks de los repositorios
  const mockLoginRepository = {
    obtenerPorUsername: jest.fn(),
    eliminarPorUsername: jest.fn(), // Agregado porque tu Util lo usa
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("obtenerPassword", () => {
    it("Debería retornar error 400 si no se encontró usuario", async () => {
      mockLoginRepository.obtenerPorUsername.mockResolvedValue(null);

      await expect(
        AuthUtil.obtenerPassword(mockLoginRepository as any, "user", "pass"),
      ).rejects.toMatchObject({
        data: {
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: "No se encontro usuario con ese username en login",
        },
      });
    });

    it("Debería retornar error 400 si el passwordDecrypted está vacío o dañado", async () => {
      mockLoginRepository.obtenerPorUsername.mockResolvedValue({
        confirmPassword: "password_encriptado_en_db",
      });

      jest.spyOn(EncryptUtil, "decryptBase64").mockReturnValue("");

      await expect(
        AuthUtil.obtenerPassword(mockLoginRepository as any, "user", "pass"),
      ).rejects.toMatchObject({
        data: {
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: "La contraseña no es correcta",
        },
      });
    });

    it("Debería retornar el par de contraseñas si todo es correcto (Happy Path)", async () => {
      const passEncriptado = "hash123";
      const passDesencriptado = "password_limpio";

      mockLoginRepository.obtenerPorUsername.mockResolvedValue({
        confirmPassword: passEncriptado,
      });

      jest
        .spyOn(EncryptUtil, "decryptBase64")
        .mockReturnValue(passDesencriptado);
      const result = await AuthUtil.obtenerPassword(
        mockLoginRepository as any,
        "username",
        "password",
      );

      expect(result).toEqual([passEncriptado, passDesencriptado]);
      expect(mockLoginRepository.eliminarPorUsername).toHaveBeenCalled();
    });
  });
});
