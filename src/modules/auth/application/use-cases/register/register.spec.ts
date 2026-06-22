import { RegisterUseCase } from "./register.use-case";
import { CustomError } from "../../../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../../../shared/domain/enum/custom-error.enum";
import { EstadoUsuarioEnum } from "../../../../../shared/domain/enum/estado-usuario.enum";
import { AuthUtil } from "../../../util/autil.util";
import { ValidateUtil } from "../../../util/validate.util";
import { hash } from "bcrypt";
import { v4 } from "uuid";

jest.mock("bcrypt", () => ({
    hash: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(),
}));

describe("RegisterUseCase", () => {
    let registerUseCase: RegisterUseCase;

    const mockRedisService = {
        set: jest.fn(),
        get: jest.fn(),
    };

    const mockAuditoriaRepository = {
        save: jest.fn(),
    };

    const mockEntityManager = {};
    const mockDataSource = {
        transaction: jest.fn()
    };

    const mockLoginRepo = {
        setTransactionManager: jest.fn().mockReturnThis(),
    };

    const mockUsuarioRepo = {
        setTransactionManager: jest.fn().mockReturnThis(),
        create: jest.fn(),
    };

    const mockPersonaRepo = {
        setTransactionManager: jest.fn().mockReturnThis(),
        create: jest.fn(),
    };

    const mockRegistrarUsuarioRepo = {
        setTransactionManager: jest.fn().mockReturnThis(),
        insertar: jest.fn(),
        existe: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockDataSource.transaction.mockImplementation(async (callback) => {
            return await callback(mockEntityManager);
        });

        registerUseCase = new RegisterUseCase(
            mockDataSource as any,
            mockUsuarioRepo as any,
            mockLoginRepo as any,
            mockPersonaRepo as any,
            mockRegistrarUsuarioRepo as any,
            mockRedisService as any,
            mockAuditoriaRepository as any
        );
    });

    describe("register()", () => {

        it("debería lanzar un error 409 si el rqUUID ya fue procesado en la base de datos", async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockRegistrarUsuarioRepo.existe.mockResolvedValue(true);

            const registerDto = {
                username: "admin",
                password: "password",
                rqUUID: "uuid-repetido",
                nombres: "Juan",
                apellidoPaterno: "Perez",
                apellidoMaterno: "Gomez",
                numeroDocumento: "12345678",
                numeroTelefono: "123456789",
                email: "juan@mail.com",
                idTipoDocumento: 1,
                ip: "127.0.0.1",
                userAgent: "Mozilla/5.0"
            };

            await expect(registerUseCase.execute(registerDto)).rejects.toThrow(
                new CustomError({
                    statusCode: HttpStatusCode.CONFLICT,
                    titulo: "Petición ya atendida",
                    message: "La petición ya fue atendida, recargue la página",
                })
            );
        });

        it("debería registrar al usuario y a la persona correctamente en el flujo de éxito", async () => {
            mockRedisService.get.mockResolvedValue(null);
            mockRedisService.set.mockResolvedValue("OK");
            mockRegistrarUsuarioRepo.existe.mockResolvedValue(false);

            jest.spyOn(ValidateUtil, "existeUsuarioARegistrar").mockResolvedValue(undefined as any);
            jest.spyOn(AuthUtil, "obtenerPassword").mockResolvedValue(["1", "passwordPlanoProvicional"]);

            const mockPasswordHashed = "$2b$10$hashedPassword12345";
            (hash as jest.Mock).mockResolvedValue(mockPasswordHashed);

            const mockPublicKeyUuid = "mocked-public-key-v4";
            (v4 as jest.Mock).mockReturnValue(mockPublicKeyUuid);

            const baseTime = new Date("2026-06-15T12:00:00.000Z");
            jest.useFakeTimers().setSystemTime(baseTime);

            const personaMockCreada = { id: "persona-id-777" };
            mockPersonaRepo.create.mockResolvedValue(personaMockCreada);

            const usuarioMockCreado = {
                id: "usuario-id-999",
                username: "sebastiandomenack",
                idPersona: "persona-id-777",
                idEstado: EstadoUsuarioEnum.Activo
            };
            mockUsuarioRepo.create.mockResolvedValue(usuarioMockCreado);

            mockRegistrarUsuarioRepo.insertar.mockResolvedValue([]);
            mockAuditoriaRepository.save.mockResolvedValue({});

            const registerDto = {
                username: "sebastiandomenack",
                password: "passwordSeguro",
                rqUUID: "uuid-unico-registro",
                nombres: "Sebastian",
                apellidoPaterno: "Domenack",
                apellidoMaterno: "Perez",
                numeroDocumento: "77777777",
                numeroTelefono: "999999999",
                email: "sebastian@mail.com",
                idTipoDocumento: 1,
                ip: "::1",
                userAgent: "bruno-runtime/3.3.0"
            };

            const resultado = await registerUseCase.execute(registerDto);

            expect(resultado).toEqual({
                message: "Usuario registrado correctamente",
                data: { usuario: usuarioMockCreado },
            });
            expect(mockPersonaRepo.create).toHaveBeenCalledWith({
                nombres: registerDto.nombres,
                apellidoPaterno: registerDto.apellidoPaterno,
                apellidoMaterno: registerDto.apellidoMaterno,
                numeroDocumento: registerDto.numeroDocumento,
                numeroTelefono: registerDto.numeroTelefono,
                email: registerDto.email,
                idTipoDocumento: registerDto.idTipoDocumento,
            });

            expect(mockUsuarioRepo.create).toHaveBeenCalledWith({
                username: registerDto.username,
                password: mockPasswordHashed,
                idPersona: "persona-id-777",
                idEstado: EstadoUsuarioEnum.Activo,
                intentosFallidos: 0,
                publicKey: mockPublicKeyUuid,
                fechaCreacion: baseTime,
                esActivo: true,
            });

            expect(mockRegistrarUsuarioRepo.insertar).toHaveBeenCalledWith([
                { uuid: registerDto.rqUUID, fecha: baseTime }
            ]);

            expect(mockAuditoriaRepository.save).toHaveBeenCalledWith({
                usuario: registerDto.username,
                accion: "Register",
                detalles: { rqUUID: registerDto.rqUUID }
            });

            jest.useRealTimers();
        });

        it("debería lanzar un error 409 si la petición ya existe en la caché de Redis", async () => {

            mockRedisService.get.mockResolvedValue("true");

            const registerDto = {
                username: "sebastiandomenack",
                password: "passwordSeguro",
                rqUUID: "uuid-en-proceso",
                nombres: "Sebastian",
                apellidoPaterno: "Domenack",
                apellidoMaterno: "Perez",
                numeroDocumento: "77777777",
                numeroTelefono: "999999999",
                email: "sebastian@mail.com",
                idTipoDocumento: 1,
                ip: "::1",
                userAgent: "bruno-runtime/3.3.0"
            };

            await expect(registerUseCase.execute(registerDto)).rejects.toThrow(
                new CustomError({
                    statusCode: HttpStatusCode.CONFLICT,
                    titulo: "Petición en proceso o atendida",
                    message: "La petición de registro ya fue procesada (Redis Cache)",
                })
            );

            expect(mockDataSource.transaction).not.toHaveBeenCalled();
        });
    });
});