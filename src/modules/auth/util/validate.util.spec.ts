import { HttpStatusCode } from "../../../shared/domain/enum/custom-error.enum";
import { EstadoUsuarioEnum } from "../../../shared/domain/enum/estado-usuario.enum";
import { ValidateUtil } from "./validate.util";
import { UsuarioEntity } from "../../../shared/database/entities/core/usuario.entity";
import { RegisterDto } from "../dto/register.dto";

describe("ValidateUtil", () => {
  describe("validateEstadoUsuario", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("debería retornar true si el estado es Activo", () => {
      const result = ValidateUtil.validateEstadoUsuario(
        EstadoUsuarioEnum.Activo,
      );
      expect(result.esValido).toBe(true);
    });

    it("debería lanzar CustomError 409 si está bloqueado temporalmente", () => {
      try {
        ValidateUtil.validateEstadoUsuario(
          EstadoUsuarioEnum.BloqueadoTemporalmente,
        );
      } catch (error: any) {
        expect(error.data.statusCode).toBe(HttpStatusCode.CONFLICT);
        expect(error.data.message).toBe(
          "El usuario está bloqueado temporalmente",
        );
      }
    });

    it("debería lanzar CustomError 409 si está bloqueado indefinidamente", () => {
      try {
        ValidateUtil.validateEstadoUsuario(
          EstadoUsuarioEnum.BloqueadoIndefinidamente,
        );
      } catch (error: any) {
        expect(error.data.statusCode).toBe(HttpStatusCode.CONFLICT);
        expect(error.data.message).toBe(
          "El usuario está bloqueado indefinidamente",
        );
      }
    });

    it("debería lanzar CustomError 409 si está deshabilitado", () => {
      try {
        ValidateUtil.validateEstadoUsuario(EstadoUsuarioEnum.Deshabilitado);
      } catch (error: any) {
        expect(error.data.statusCode).toBe(HttpStatusCode.CONFLICT);
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
        ValidateUtil.validarExistenciaUsuario({
          id: 1,
          username: "username",
          password: "password",
          idPersona: 1,
          idEstado: 1,
          publicKey: "publicKey",
          intentosFallidos: 0,
        } as unknown as UsuarioEntity);
      } catch (error) {}
    });
    it("debería lanzar CustomError 404 si el usuario no existe", () => {
      try {
        ValidateUtil.validarExistenciaUsuario(null);
      } catch (error: any) {
        expect(error.data.statusCode).toBe(HttpStatusCode.NOT_FOUND);
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

      const result = await ValidateUtil.existeUsuarioARegistrar(
        mockUsuarioRepo as any,
        mockPersonaRepo as any,
        {
          username: "username",
          password: "password",
          numeroDocumento: "numeroDocumento",
          idTipoDocumento: 1,
          nombres: "nombres",
          apellidoPaterno: "apellidoPaterno",
          apellidoMaterno: "apellidoMaterno",
        } as RegisterDto,
      );

      expect(result.esValido).toBe(true);
    });

    it("Debe retornar bad request  si existe usuario", async () => {
      mockUsuarioRepo.existeUsuario.mockResolvedValue(true);
      mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(false);

      await expect(
        ValidateUtil.existeUsuarioARegistrar(
          mockUsuarioRepo as any,
          mockPersonaRepo as any,
          {
            username: "username",
            password: "password",
            numeroDocumento: "numeroDocumento",
            idTipoDocumento: 1,
            nombres: "nombres",
            apellidoPaterno: "apellidoPaterno",
            apellidoMaterno: "apellidoMaterno",
          } as RegisterDto,
        ),
      ).rejects.toMatchObject({
        data: {
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: "El usuario ya existe en el sistema",
        },
      });
    });

    it("Debe retornar bad request si existe persona", async () => {
      mockUsuarioRepo.existeUsuario.mockResolvedValue(false);
      mockPersonaRepo.existePersonaPorNumeroDocumento.mockResolvedValue(true);

      await expect(
        ValidateUtil.existeUsuarioARegistrar(
          mockUsuarioRepo as any,
          mockPersonaRepo as any,
          {
            username: "username",
            password: "password",
            numeroDocumento: "numeroDocumento",
            idTipoDocumento: 1,
            nombres: "nombres",
            apellidoPaterno: "apellidoPaterno",
            apellidoMaterno: "apellidoMaterno",
          } as RegisterDto,
        ),
      ).rejects.toMatchObject({
        data: {
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: "La persona ya existe en el sistema",
        },
      });
    });
  });
});
