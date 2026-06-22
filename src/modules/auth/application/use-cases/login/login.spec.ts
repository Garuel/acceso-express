import { DataSource } from "typeorm";
import { LoginUseCase } from "./login.use-case"
import { CustomError } from "../../../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../../../shared/domain/enum/custom-error.enum";
import { AuthUtil } from "../../../util/autil.util";
import { compare } from "bcrypt";
import { ValidateUtil } from "../../../util/validate.util";
import { BuildUtil } from "../../../../../shared/infrastructure/utils/build.util";

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));

describe("LoginUseCase", () => {
    let loginUseCase: LoginUseCase
    const mockLoginRepo = {
        setTransactionManager: jest.fn().mockReturnThis(),
        obtenerPorUsername: jest.fn(),
        eliminarPorUsername: jest.fn(),
    };

    const mockLoginRequestRepo = {
        existe: jest.fn(),
        setTransactionManager: jest.fn().mockReturnThis(),
        insertar: jest.fn(),
        obtenerPorUsername: jest.fn(),
    };

    const mockEntityManager = {};
    const mockDataSource = {
        transaction: jest.fn()
    };

    const mockUsuarioRepo = {
        setTransactionManager: jest.fn().mockReturnThis(),
        getUsuarioPorUsername: jest.fn(),
    };


    const mockRedisService = {
        set: jest.fn(),
        get: jest.fn(),
    };

    const mockAuditoriaRepository = {
        save: jest.fn(),
    };

    const mockTokenManagerService = {
        generateTokens: jest.fn(),
    };

    const mockUsuarioRefreshTokenRepo = {
        create: jest.fn(),
        setTransactionManager: jest.fn().mockReturnThis(),
    }



    beforeEach(() => {
        jest.clearAllMocks();

        mockDataSource.transaction.mockImplementation(async (callback) => {
            return await callback(mockEntityManager);
        });

        loginUseCase = new LoginUseCase(
            mockDataSource as any,
            mockTokenManagerService as any,
            mockUsuarioRepo as any,
            mockLoginRepo as any,
            mockLoginRequestRepo as any,
            mockUsuarioRefreshTokenRepo as any,
            mockRedisService as any,
            mockAuditoriaRepository as any
        )
    })


    describe("login()", () => {
        it("debería lanzar un error 409 si el rqUUID ya fue procesado", async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockLoginRequestRepo.existe.mockResolvedValue(true);
            const loginDto = {
                username: "admin",
                password: "password",
                rqUUID: "uuid-repetido",
                ip: "[IP_ADDRESS]",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            await expect(loginUseCase.execute(loginDto)).rejects.toThrow(
                new CustomError({
                    statusCode: HttpStatusCode.CONFLICT,
                    titulo: "Petición ya atendida",
                    message: "La petición ya fue atendida, recargue la página",
                })
            );
        })

        it("debería lanzar error 401 password incorrecta", async () => {
            mockLoginRequestRepo.existe.mockResolvedValue(false);
            mockRedisService.get.mockResolvedValue(null);
            mockLoginRepo.setTransactionManager.mockReturnValue(mockLoginRepo);
            mockLoginRepo.obtenerPorUsername.mockResolvedValue({
                id: "123",
                username: "sebastiandomenack",
                confirmPassword: "passwordPlanoFalso",
                fechaExpiracion: new Date(Date.now() + 300000),
            });
            jest.spyOn(AuthUtil, "obtenerPassword").mockResolvedValue(["1", "passwordPlanoFalso"]);


            mockUsuarioRepo.getUsuarioPorUsername.mockResolvedValue({
                id: "usuario-id-123",
                username: "sebastiandomenack",
                password: "$2b$10$PasswordEncriptadoFalso",
                idEstado: 1
            });


            (compare as jest.Mock).mockResolvedValue(false);

            const loginDto = {
                username: "sebastiandomenack",
                password: "passwordIncorrecta",
                rqUUID: "uuid-nuevo",
                ip: "::1",
                userAgent: "bruno-runtime/3.3.0"
            };

            await expect(loginUseCase.execute(loginDto)).rejects.toThrow(
                new CustomError({
                    statusCode: HttpStatusCode.UNAUTHORIZED,
                    message: "Contraseña incorrecta"
                })
            );
        })

        it("debería retornar los tokens de acceso cuando el login es exitoso", async () => {

            mockRedisService.get.mockResolvedValue(null);
            mockRedisService.set.mockResolvedValue("OK");
            mockLoginRequestRepo.existe.mockResolvedValue(false);


            mockDataSource.transaction.mockImplementation(async (callback) => await callback(mockEntityManager));

            mockUsuarioRepo.setTransactionManager.mockReturnThis();
            mockLoginRepo.setTransactionManager.mockReturnThis();
            mockLoginRequestRepo.setTransactionManager.mockReturnThis();
            mockUsuarioRefreshTokenRepo.setTransactionManager.mockReturnThis();


            jest.spyOn(AuthUtil, "obtenerPassword").mockResolvedValue(["1", "passwordPlanoVerdadero"]);

            const usuarioMock = {
                id: "usuario-id-123",
                username: "sebastiandomenack",
                password: "$2b$10$PasswordEncriptadoVerdadero",
                idEstado: 1
            };
            mockUsuarioRepo.getUsuarioPorUsername.mockResolvedValue(usuarioMock);

            jest.spyOn(ValidateUtil, "validarExistenciaUsuario").mockReturnValue({ esValido: true });
            jest.spyOn(ValidateUtil, "validateEstadoUsuario").mockReturnValue({ esValido: true });


            (compare as jest.Mock).mockResolvedValue(true);

            jest.spyOn(BuildUtil, "buildRandomEnRango").mockReturnValue(123456);
            jest.spyOn(BuildUtil, "buildUsuarioInfoToken").mockReturnValue({ id: "123", username: "sebastiandomenack" } as any);

            const tokensSimulados = { accessToken: "access-token-fake", refreshToken: "refresh-token-fake" };
            jest.spyOn(mockTokenManagerService, "generateTokens").mockReturnValue(tokensSimulados);

            mockLoginRequestRepo.insertar.mockResolvedValue([]);
            mockUsuarioRefreshTokenRepo.create.mockResolvedValue({});
            mockAuditoriaRepository.save.mockResolvedValue({});

            const loginDto = {
                username: "sebastiandomenack",
                password: "passwordCorrecta",
                rqUUID: "uuid-nuevo",
                ip: "::1",
                userAgent: "bruno-runtime/3.3.0"
            };

            const resultado = await loginUseCase.execute(loginDto);

            expect(resultado).toEqual({
                message: "Login exitoso",
                data: {
                    accessToken: "access-token-fake",
                    refreshToken: "refresh-token-fake"
                }
            });

            expect(mockAuditoriaRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                usuario: "sebastiandomenack",
                accion: "LOGIN"
            }));
        });

    })
})