"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_enum_1 = require("../../../shared/domain/enum/custom-error.enum");
const estado_usuario_enum_1 = require("../../../shared/domain/enum/estado-usuario.enum");
const validate_util_1 = require("./validate.util");
const custom_error_class_1 = require("../../../shared/domain/classes/custom-error.class");
const tiempo_max_gracia_token_refresh_constat_1 = require("../constants/tiempo-max-gracia-token-refresh.constat");
describe("ValidateUtil", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("validateEstadoUsuario", () => {
        it("debería retornar true si el estado es Activo", () => {
            const result = validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.Activo);
            expect(result.esValido).toBe(true);
        });
        it("debería lanzar CustomError 409 si está bloqueado temporalmente", () => {
            expect(() => validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.BloqueadoTemporalmente)).toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                message: "El usuario está bloqueado temporalmente",
            }));
        });
        it("debería lanzar CustomError 409 si está bloqueado indefinidamente", () => {
            expect(() => validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.BloqueadoIndefinidamente)).toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                message: "El usuario está bloqueado indefinidamente",
            }));
        });
        it("debería lanzar CustomError 409 si está deshabilitado", () => {
            expect(() => validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.Deshabilitado)).toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.CONFLICT,
                message: "El usuario está deshabilitado",
            }));
        });
    });
    describe("validarExistenciaUsuario", () => {
        it("debería retornar true si el usuario existe", () => {
            const usuarioMock = {
                id: 1,
                username: "username",
            };
            const result = validate_util_1.ValidateUtil.validarExistenciaUsuario(usuarioMock);
            expect(result.esValido).toBe(true);
        });
        it("debería lanzar CustomError 404 si el usuario no existe", () => {
            expect(() => validate_util_1.ValidateUtil.validarExistenciaUsuario(null)).toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.NOT_FOUND,
                message: "El usuario no está registrado",
            }));
        });
    });
    describe("existeUsuarioARegistrar", () => {
        const mockUsuarioRepo = { existeUsuario: jest.fn() };
        const mockPersonaRepo = { existePersonaPorNumeroDocumento: jest.fn() };
        const registerDtoMock = {
            username: "username",
            numeroDocumento: "12345678",
        };
        it("Debe retornar true si no existe usuario y persona", async () => {
            mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
            mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);
            const result = await validate_util_1.ValidateUtil.existeUsuarioARegistrar(mockUsuarioRepo, mockPersonaRepo, registerDtoMock);
            expect(result.esValido).toBe(true);
        });
        it("Debe retornar bad request si existe usuario", async () => {
            mockUsuarioRepo.existeUsuario.mockResolvedValue(true);
            mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);
            await expect(validate_util_1.ValidateUtil.existeUsuarioARegistrar(mockUsuarioRepo, mockPersonaRepo, registerDtoMock)).rejects.toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                message: "El usuario ya existe en el sistema",
            }));
        });
        it("Debe retornar bad request si existe persona", async () => {
            mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
            mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(true);
            await expect(validate_util_1.ValidateUtil.existeUsuarioARegistrar(mockUsuarioRepo, mockPersonaRepo, registerDtoMock)).rejects.toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                message: "La persona ya existe en el sistema",
            }));
        });
    });
    describe("validarTiempoDeGracia", () => {
        const usuarioRepositoryMock = { getUsuarioPorId: jest.fn() };
        const usuarioRefreshTokenRepositoryMock = { eliminarTodosLosTokensDelUsuario: jest.fn() };
        const accessJwtServiceMock = { sign: jest.fn() };
        const idUsuarioMock = 1;
        it("Debe retornar 401 si intenta usar un token usado tiempo atras", async () => {
            usuarioRefreshTokenRepositoryMock.eliminarTodosLosTokensDelUsuario.mockResolvedValue({});
            usuarioRepositoryMock.getUsuarioPorId.mockResolvedValue({});
            accessJwtServiceMock.sign.mockReturnValue("token");
            const segundosDesdeElPrimerUso = tiempo_max_gracia_token_refresh_constat_1.TIEMPO_GRACIA_SEGUNDOS + 100;
            const usuarioRefreshTokenEntityMock = {
                fechaUso: new Date(Date.now() - segundosDesdeElPrimerUso * 1000),
            };
            await expect(validate_util_1.ValidateUtil.validarTiempoDeGracia(usuarioRefreshTokenEntityMock, usuarioRepositoryMock, usuarioRefreshTokenRepositoryMock, accessJwtServiceMock, idUsuarioMock)).rejects.toThrow(new custom_error_class_1.CustomError({
                statusCode: custom_error_enum_1.HttpStatusCode.UNAUTHORIZED,
                message: "Brecha de seguridad detectada. Inicie sesión nuevamente.",
            }));
        });
        it("Debe retornar bien los tokens porque es una petición concurrente", async () => {
            usuarioRepositoryMock.getUsuarioPorId.mockResolvedValue({
                id: 1,
                username: "test",
                idEstado: 1,
                publicKey: "mock-public-key",
                persona: {
                    email: "test@correo.com",
                    nombres: "Juan",
                    apellidoPaterno: "Perez",
                    apellidoMaterno: "Gomez",
                    tipoDocumento: {
                        id: 1,
                        nombre: 'DNI'
                    }
                }
            });
            accessJwtServiceMock.sign.mockReturnValue("token");
            const segundosDesdeElPrimerUso = tiempo_max_gracia_token_refresh_constat_1.TIEMPO_GRACIA_SEGUNDOS - 10;
            const usuarioRefreshTokenEntityMock = {
                fechaUso: new Date(Date.now() - segundosDesdeElPrimerUso * 1000),
            };
            const result = await validate_util_1.ValidateUtil.validarTiempoDeGracia(usuarioRefreshTokenEntityMock, usuarioRepositoryMock, usuarioRefreshTokenRepositoryMock, accessJwtServiceMock, idUsuarioMock);
            expect(result).toEqual({
                esConcurrente: true,
                tokens: {
                    accessToken: "token",
                    refreshToken: usuarioRefreshTokenEntityMock.refreshToken,
                },
            });
        });
        it("Debe retornar concurencia false si es la primera vez que genera el token", async () => {
            const usuarioRefreshTokenEntityMock = {
                fechaUso: null,
            };
            const result = await validate_util_1.ValidateUtil.validarTiempoDeGracia(usuarioRefreshTokenEntityMock, usuarioRepositoryMock, usuarioRefreshTokenRepositoryMock, accessJwtServiceMock, idUsuarioMock);
            expect(result).toEqual({
                esConcurrente: false,
            });
        });
    });
});
