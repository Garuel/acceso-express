import { UsuarioRefreshTokenEntity } from "../../../shared/database/entities/core/usuario-refresh-token.entity";
import { UsuarioEntity } from "../../../shared/database/entities/core/usuario.entity";
import { CustomError } from "../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../shared/domain/enum/custom-error.enum";
import { EstadoUsuarioEnum } from "../../../shared/domain/enum/estado-usuario.enum";
import { RegisterDto } from "../application/use-cases/register/dto/register.dto";
import { TIEMPO_GRACIA_SEGUNDOS } from "../constants/tiempo-max-gracia-token-refresh.constat";
import { ValidateUtil } from "./validate.util";

describe("ValidateUtil", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateEstadoUsuario", () => {
    it("debería retornar true si el estado es Activo", () => {
      const result = ValidateUtil.validateEstadoUsuario(EstadoUsuarioEnum.Activo);
      expect(result.esValido).toBe(true);
    });

    it("debería lanzar CustomError 409 si está bloqueado temporalmente", () => {
      expect(() =>
        ValidateUtil.validateEstadoUsuario(EstadoUsuarioEnum.BloqueadoTemporalmente)
      ).toThrow(
        new CustomError({
          statusCode: HttpStatusCode.CONFLICT,
          message: "El usuario está bloqueado temporalmente",
        })
      );
    });

    it("debería lanzar CustomError 409 si está bloqueado indefinidamente", () => {
      expect(() =>
        ValidateUtil.validateEstadoUsuario(EstadoUsuarioEnum.BloqueadoIndefinidamente)
      ).toThrow(
        new CustomError({
          statusCode: HttpStatusCode.CONFLICT,
          message: "El usuario está bloqueado indefinidamente",
        })
      );
    });

    it("debería lanzar CustomError 409 si está deshabilitado", () => {
      expect(() =>
        ValidateUtil.validateEstadoUsuario(EstadoUsuarioEnum.Deshabilitado)
      ).toThrow(
        new CustomError({
          statusCode: HttpStatusCode.CONFLICT,
          message: "El usuario está deshabilitado",
        })
      );
    });
  });

  describe("validarExistenciaUsuario", () => {
    it("debería retornar true si el usuario existe", () => {
      const usuarioMock = {
        id: 1,
        username: "username",
      } as UsuarioEntity;

      const result = ValidateUtil.validarExistenciaUsuario(usuarioMock);

      expect(result.esValido).toBe(true);
    });

    it("debería lanzar CustomError 404 si el usuario no existe", () => {
      expect(() =>
        ValidateUtil.validarExistenciaUsuario(null)
      ).toThrow(
        new CustomError({
          statusCode: HttpStatusCode.NOT_FOUND,
          message: "El usuario no está registrado",
        })
      );
    });
  });

  describe("existeUsuarioARegistrar", () => {
    const mockUsuarioRepo = { existeUsuario: jest.fn() };
    const mockPersonaRepo = { existePersonaPorNumeroDocumento: jest.fn() };

    const registerDtoMock = {
      username: "username",
      numeroDocumento: "12345678",
    } as RegisterDto;

    it("Debe retornar true si no existe usuario y persona", async () => {
      mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
      mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);

      const result = await ValidateUtil.existeUsuarioARegistrar(
        mockUsuarioRepo as any,
        mockPersonaRepo as any,
        registerDtoMock,
      );

      expect(result.esValido).toBe(true);
    });

    it("Debe retornar bad request si existe usuario", async () => {
      mockUsuarioRepo.existeUsuario.mockResolvedValue(true);
      mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);

      await expect(
        ValidateUtil.existeUsuarioARegistrar(
          mockUsuarioRepo as any,
          mockPersonaRepo as any,
          registerDtoMock,
        )
      ).rejects.toThrow(
        new CustomError({
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: "El usuario ya existe en el sistema",
        })
      );
    });

    it("Debe retornar bad request si existe persona", async () => {
      mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
      mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(true);

      await expect(
        ValidateUtil.existeUsuarioARegistrar(
          mockUsuarioRepo as any,
          mockPersonaRepo as any,
          registerDtoMock,
        )
      ).rejects.toThrow(
        new CustomError({
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: "La persona ya existe en el sistema",
        })
      );
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

      const segundosDesdeElPrimerUso = TIEMPO_GRACIA_SEGUNDOS + 100;
      const usuarioRefreshTokenEntityMock = {
        fechaUso: new Date(Date.now() - segundosDesdeElPrimerUso * 1000),
      } as UsuarioRefreshTokenEntity;


      await expect(
        ValidateUtil.validarTiempoDeGracia(
          usuarioRefreshTokenEntityMock,
          usuarioRepositoryMock as any,
          usuarioRefreshTokenRepositoryMock as any,
          accessJwtServiceMock as any,
          idUsuarioMock,
        )
      ).rejects.toThrow(
        new CustomError({
          statusCode: HttpStatusCode.UNAUTHORIZED,
          message: "Brecha de seguridad detectada. Inicie sesión nuevamente.",
        })
      );
    })

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

      const segundosDesdeElPrimerUso = TIEMPO_GRACIA_SEGUNDOS - 10;
      const usuarioRefreshTokenEntityMock = {
        fechaUso: new Date(Date.now() - segundosDesdeElPrimerUso * 1000),
      } as UsuarioRefreshTokenEntity;

      const result = await ValidateUtil.validarTiempoDeGracia(
        usuarioRefreshTokenEntityMock,
        usuarioRepositoryMock as any,
        usuarioRefreshTokenRepositoryMock as any,
        accessJwtServiceMock as any,
        idUsuarioMock,
      )
      expect(
        result
      ).toEqual({
        esConcurrente: true,
        tokens: {
          accessToken: "token",
          refreshToken: usuarioRefreshTokenEntityMock.refreshToken,
        },
      });
    })

    it("Debe retornar concurencia false si es la primera vez que genera el token", async () => {
      const usuarioRefreshTokenEntityMock = {
        fechaUso: null,
      } as UsuarioRefreshTokenEntity;

      const result = await ValidateUtil.validarTiempoDeGracia(
        usuarioRefreshTokenEntityMock,
        usuarioRepositoryMock as any,
        usuarioRefreshTokenRepositoryMock as any,
        accessJwtServiceMock as any,
        idUsuarioMock,
      )

      expect(
        result
      ).toEqual({
        esConcurrente: false,
      });
    })
  })
});