"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_enum_1 = require("../../../shared/domain/enum/custom-error.enum");
const estado_usuario_enum_1 = require("../../../shared/domain/enum/estado-usuario.enum");
const validate_util_1 = require("./validate.util");
describe("ValidateUtil", () => {
    describe("validateEstadoUsuario", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("debería retornar true si el estado es Activo", () => {
            const result = validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.Activo);
            expect(result.esValido).toBe(true);
        });
        it("debería lanzar CustomError 409 si está bloqueado temporalmente", () => {
            try {
                validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.BloqueadoTemporalmente);
            }
            catch (error) {
                expect(error.data.statusCode).toBe(custom_error_enum_1.HttpStatusCode.CONFLICT);
                expect(error.data.message).toBe("El usuario está bloqueado temporalmente");
            }
        });
        it("debería lanzar CustomError 409 si está bloqueado indefinidamente", () => {
            try {
                validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.BloqueadoIndefinidamente);
            }
            catch (error) {
                expect(error.data.statusCode).toBe(custom_error_enum_1.HttpStatusCode.CONFLICT);
                expect(error.data.message).toBe("El usuario está bloqueado indefinidamente");
            }
        });
        it("debería lanzar CustomError 409 si está deshabilitado", () => {
            try {
                validate_util_1.ValidateUtil.validateEstadoUsuario(estado_usuario_enum_1.EstadoUsuarioEnum.Deshabilitado);
            }
            catch (error) {
                expect(error.data.statusCode).toBe(custom_error_enum_1.HttpStatusCode.CONFLICT);
                expect(error.data.message).toBe("El usuario está deshabilitado");
            }
        });
    });
    describe("validarExistenciaUsuario", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("debería retornar true si el usuario existe", () => {
            try {
                validate_util_1.ValidateUtil.validarExistenciaUsuario({
                    id: 1,
                    username: "username",
                    password: "password",
                    idPersona: 1,
                    idEstado: 1,
                    publicKey: "publicKey",
                    intentosFallidos: 0,
                });
            }
            catch (error) { }
        });
        it("debería lanzar CustomError 404 si el usuario no existe", () => {
            try {
                validate_util_1.ValidateUtil.validarExistenciaUsuario(null);
            }
            catch (error) {
                expect(error.data.statusCode).toBe(custom_error_enum_1.HttpStatusCode.NOT_FOUND);
                expect(error.data.message).toBe("El usuario no está registrado");
            }
        });
    });
    describe("existeUsuarioARegistrar", () => {
        const mockUsuarioRepo = {
            existeUsuario: jest.fn(),
        };
        const mockPersonaRepo = {
            existePersonaPorNumeroDocumento: jest.fn(),
        };
        beforeEach(() => {
            jest.clearAllMocks();
        });
        //CAMINO FELIZ
        it("Debe retornar true si no existe usuario y persona", async () => {
            mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
            mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);
            const result = await validate_util_1.ValidateUtil.existeUsuarioARegistrar(mockUsuarioRepo, mockPersonaRepo, {
                username: "username",
                password: "password",
                numeroDocumento: "numeroDocumento",
                idTipoDocumento: 1,
                nombres: "nombres",
                apellidoPaterno: "apellidoPaterno",
                apellidoMaterno: "apellidoMaterno",
            });
            expect(result.esValido).toBe(true);
        });
        it("Debe retornar bad request  si existe usuario", async () => {
            mockUsuarioRepo.existeUsuario.mockResolvedValue(true);
            mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);
            await expect(validate_util_1.ValidateUtil.existeUsuarioARegistrar(mockUsuarioRepo, mockPersonaRepo, {
                username: "username",
                password: "password",
                numeroDocumento: "numeroDocumento",
                idTipoDocumento: 1,
                nombres: "nombres",
                apellidoPaterno: "apellidoPaterno",
                apellidoMaterno: "apellidoMaterno",
            })).rejects.toMatchObject({
                data: {
                    statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                    message: "El usuario ya existe en el sistema",
                },
            });
        });
        it("Debe retornar bad request si existe persona", async () => {
            mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
            mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(true);
            await expect(validate_util_1.ValidateUtil.existeUsuarioARegistrar(mockUsuarioRepo, mockPersonaRepo, {
                username: "username",
                password: "password",
                numeroDocumento: "numeroDocumento",
                idTipoDocumento: 1,
                nombres: "nombres",
                apellidoPaterno: "apellidoPaterno",
                apellidoMaterno: "apellidoMaterno",
            })).rejects.toMatchObject({
                data: {
                    statusCode: custom_error_enum_1.HttpStatusCode.BAD_REQUEST,
                    message: "La persona ya existe en el sistema",
                },
            });
        });
    });
});
