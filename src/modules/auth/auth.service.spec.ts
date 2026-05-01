import "reflect-metadata";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "../../shared/domain/enum/custom-error.enum";

describe("AuthService", () => {
  let service: AuthService;

  const mockLoginUsuarioRequestRepo = {
    setTransactionManager: jest.fn().mockReturnThis(),
    existe: jest.fn(),
  };

  const mockUsuarioRepo = {
    setTransactionManager: jest.fn().mockReturnThis(),
    getUsuarioPorUsername: jest.fn(),
  };

  const mockLoginRepo = {
    setTransactionManager: jest.fn().mockReturnThis(),
    obtenerPassword: jest.fn(),
    obtenerPorUsername: jest.fn(),
    eliminarPorUsername: jest.fn(),
  };

  const mockPersonaRepo = {
    setTransactionManager: jest.fn().mockReturnThis(),
    create: jest.fn(),
  };

  const mockRegistrarUsuarioRequestRepo = {
    setTransactionManager: jest.fn().mockReturnThis(),
    existe: jest.fn(),
    insertar: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(async (cb) => cb("mock-manager")),
  };

  const mockUsuarioRefreshTokenRepo = {
    setTransactionManager: jest.fn().mockReturnThis(),
    create: jest.fn(),
    obtenerPorToken: jest.fn(),
    eliminarPorId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      mockDataSource as any,
      {} as any, // accessJwt
      {} as any, // refreshJwt
      mockUsuarioRepo as any, // usuarioRepo
      mockLoginRepo as any, // loginRepo
      mockPersonaRepo as any, // personaRepo
      mockLoginUsuarioRequestRepo as any, // loginUsuarioRequestRepo
      mockRegistrarUsuarioRequestRepo as any, // registrarUsuarioRequestRepo
      mockUsuarioRefreshTokenRepo as any, // usuarioRefreshTokenRepository
    );
  });

  describe("login()", () => {
    it("debería lanzar un error 409 si el rqUUID ya fue procesado", async () => {
      mockLoginUsuarioRequestRepo.existe.mockResolvedValue(true);

      const loginDto = {
        username: "sebastiandomenack",
        password: "123456789",
        rqUUID: "uuid-repetido",
      };

      try {
        await service.login(loginDto as any);
        fail("El método debería haber lanzado un CustomError");
      } catch (error: any) {
        expect(error.data.statusCode).toBe(HttpStatusCode.CONFLICT);
        expect(error.data.message).toBe(
          "La petición ya fue atendida, recargue la página",
        );
      }

      expect(mockLoginUsuarioRequestRepo.existe).toHaveBeenCalledWith(
        "uuid-repetido",
      );
    });

    it("debería lanzar un error 400 si el username no existe en login", async () => {
      mockLoginUsuarioRequestRepo.existe.mockResolvedValue(false);
      mockLoginRepo.obtenerPorUsername.mockResolvedValue(null);

      const loginDto = {
        username: "sebastiandomenack",
        password: "123456789",
        rqUUID: "uuid",
      };

      try {
        await service.login(loginDto as any);
        fail("El método debería haber lanzado un CustomError");
      } catch (error: any) {
        console.log(error);
        expect(error.data.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
        expect(error.data.message).toBe(
          "No se encontro usuario con ese username en login",
        );
      }

      expect(mockLoginRepo.obtenerPorUsername).toHaveBeenCalledWith(
        "sebastiandomenack",
      );
    });
  });
});
