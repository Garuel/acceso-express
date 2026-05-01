"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_enum_1 = require("../../../shared/domain/enum/custom-error.enum");
const encrypt_util_1 = require("../../../shared/infrastructure/utils/encrypt.util");
const autil_util_1 = require("./autil.util");
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
            await expect(autil_util_1.AuthUtil.obtenerPassword(mockLoginRepository, "user", "pass")).rejects.toMatchObject({
                data: {
                    statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                    message: "No se encontro usuario con ese username en login",
                },
            });
        });
        it("Debería retornar error 400 si el passwordDecrypted está vacío o dañado", async () => {
            mockLoginRepository.obtenerPorUsername.mockResolvedValue({
                confirmPassword: "password_encriptado_en_db",
            });
            jest.spyOn(encrypt_util_1.EncryptUtil, "decryptBase64").mockReturnValue("");
            await expect(autil_util_1.AuthUtil.obtenerPassword(mockLoginRepository, "user", "pass")).rejects.toMatchObject({
                data: {
                    statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
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
                .spyOn(encrypt_util_1.EncryptUtil, "decryptBase64")
                .mockReturnValue(passDesencriptado);
            const result = await autil_util_1.AuthUtil.obtenerPassword(mockLoginRepository, "username", "password");
            expect(result).toEqual([passEncriptado, passDesencriptado]);
            expect(mockLoginRepository.eliminarPorUsername).toHaveBeenCalled();
        });
    });
});
