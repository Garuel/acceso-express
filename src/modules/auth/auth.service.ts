import { compare, hash } from "bcrypt";
import { DataSource } from "typeorm";
import { v4 } from "uuid";
import { randomBytes } from "crypto";
import { LoginRepository } from "../../shared/database/repositories/auth/login/login.repository";
import { PersonaRepository } from "../../shared/database/repositories/core/persona/persona.repository";
import { UsuarioRepository } from "../../shared/database/repositories/core/usuario/usuario.repository";
import { RegistrarUsuarioRequestRepository } from "../../shared/database/repositories/requests/registrar-usuario/registrar-usuario-repository";
import { CustomError } from "../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../shared/domain/enum/custom-error.enum";
import { EstadoUsuarioEnum } from "../../shared/domain/enum/estado-usuario.enum";
import { ResponseAPI } from "../../shared/domain/interfaces/response.interface";
import { BuildUtil } from "../../shared/infrastructure/utils/build.util";
import { logger } from "../../shared/infrastructure/utils/logger.util";
import { JwtService } from "../jwt/jwt.service";
import { LoginDto, RefreshInfoToken, UsuarioInfoToken } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthUtil } from "./util/autil.util";
import { ValidateUtil } from "./util/validate.util";
import { TokensInterface } from "./interface/token.interface";
import { LoginUsuarioRequestRepository } from "../../shared/database/repositories/requests/login-usuario/login-usuario-repository";
import { singleton } from "tsyringe";
import { UsuarioRefreshTokenRepository } from "../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository";
import { DateUtil } from "../../shared/infrastructure/utils/date.util";
import dotenv, { configDotenv } from "dotenv";

dotenv.config();

@singleton()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accessJwtService: JwtService,
    private readonly refreshJwtService: JwtService,
    private readonly usuarioRepoInyectado: UsuarioRepository,
    private readonly loginRepoInyectado: LoginRepository,
    private readonly personaRepoInyectado: PersonaRepository,
    private readonly loginUsuarioRepoInyectado: LoginUsuarioRequestRepository,
    private readonly registrarUsuarioRepoInyectado: RegistrarUsuarioRequestRepository,
    private readonly usuarioRefreshTokenRepositoryInyectado: UsuarioRefreshTokenRepository,
  ) {}

  async login(request: LoginDto) {
    const loginResponse = await this.dataSource.transaction<ResponseAPI>(
      async (manager) => {
        const usuarioRepository =
          this.usuarioRepoInyectado.setTransactionManager(manager);
        const loginRepository =
          this.loginRepoInyectado.setTransactionManager(manager);
        const loginUsuarioRepository =
          this.loginUsuarioRepoInyectado.setTransactionManager(manager);
        const usuarioRefreshTokenRepository =
          this.usuarioRefreshTokenRepositoryInyectado.setTransactionManager(
            manager,
          );

        if (await loginUsuarioRepository.existe(request.rqUUID)) {
          throw new CustomError({
            statusCode: HttpStatusCode.CONFLICT,
            titulo: "Petición ya atendida",
            message: "La petición ya fue atendida, recargue la página",
          });
        }

        logger.info("Obteniendo data password...");
        const dataPassword = await AuthUtil.obtenerPassword(
          loginRepository,
          request.username,
          request.password,
        );
        logger.info("Data password obtenido");

        logger.info("Obteniendo usuario...");
        const usuario = await usuarioRepository.getUsuarioPorUsername(
          request.username,
        );
        logger.info("Usuario obtenido");

        ValidateUtil.validarExistenciaUsuario(usuario);

        ValidateUtil.validateEstadoUsuario(usuario!.idEstado);

        const matchesPassword = await compare(
          dataPassword[1],
          usuario!.password!,
        );
        if (!matchesPassword) {
          throw new CustomError({
            statusCode: HttpStatusCode.UNAUTHORIZED,
            message: "Contraseña incorrecta",
          });
        }

        const codigo = BuildUtil.buildRandomEnRango(100000, 999999).toString();
        const usuarioInfoToken = BuildUtil.buildUsuarioInfoToken(usuario!);

        const refreshInfo: RefreshInfoToken = {
          idUsuario: usuario!.id,
          codigo,
        };

        const tokens = this.generateTokens(usuarioInfoToken, refreshInfo);
        logger.info("Insertando rquuid...");
        await loginUsuarioRepository.insertar([
          { uuid: request.rqUUID, fecha: new Date() },
        ]);
        logger.info("Rquuid insertado");

        await usuarioRefreshTokenRepository.create({
          idUsuario: usuario!.id,
          codigo,
          refreshToken: tokens.refreshToken,
          fechaExpiracion: this.getRefreshTokenExpiration(),
        });

        return {
          message: "Login exitoso",
          data: {
            tokens,
          },
        };
      },
    );
    return loginResponse;
  }

  public async register(request: RegisterDto) {
    logger.verbose("=====REGISTER=====");
    const response = await this.dataSource.transaction<ResponseAPI>(
      async (manager) => {
        const usuarioRepository =
          this.usuarioRepoInyectado.setTransactionManager(manager);
        const personaRepository =
          this.personaRepoInyectado.setTransactionManager(manager);
        const loginRepository =
          this.loginRepoInyectado.setTransactionManager(manager);
        const registrarUsuarioRepository =
          this.registrarUsuarioRepoInyectado.setTransactionManager(manager);

        if (await registrarUsuarioRepository.existe(request.rqUUID)) {
          throw new CustomError({
            statusCode: HttpStatusCode.CONFLICT,
            titulo: "Petición ya atendida",
            message: "La petición ya fue atendida, recargue la página",
          });
        }

        await ValidateUtil.existeUsuarioARegistrar(
          usuarioRepository,
          personaRepository,
          request,
        );

        let password: string;

        logger.info("Obteniendo data password...");
        const passwordDecryptedData = await AuthUtil.obtenerPassword(
          loginRepository,
          request.username,
          request.password,
        );
        logger.info("data passsword decrypted obtenido");
        password = await hash(passwordDecryptedData[1], 10);

        logger.info("creando persona...");
        const personaInsertado = await personaRepository.create({
          nombres: request.nombres,
          apellidoPaterno: request.apellidoPaterno,
          apellidoMaterno: request.apellidoMaterno,
          numeroDocumento: request.numeroDocumento,
          numeroTelefono: request.numeroTelefono,
          email: request.email,
          idTipoDocumento: request.idTipoDocumento,
        });
        logger.info("persona creada");

        logger.info("creando usuario...");
        const usuario = await usuarioRepository.create({
          username: request.username,
          password,
          idPersona: personaInsertado.id,
          idEstado: EstadoUsuarioEnum.Activo,
          intentosFallidos: 0,
          publicKey: v4(),
          fechaCreacion: new Date(),
          esActivo: true,
        });
        logger.info("usuario creado");

        logger.info("Insertando rquuid...");
        await registrarUsuarioRepository.insertar([
          { uuid: request.rqUUID, fecha: new Date() },
        ]);
        logger.info("Rquuid insertado");

        return {
          message: "Usuario registrado correctamente",
          data: { usuario },
        };
      },
    );
    return response;
  }

  public async preRegister(
    username: string,
    ip: string,
    userAgent: string,
  ): Promise<string> {
    const loginRepository = new LoginRepository(this.dataSource);

    //  llave aleatoria de 32 caracteres (16 IV + 16 Key)
    const plainKey = randomBytes(16).toString("hex");

    await loginRepository.eliminarPorUsername(username);

    await loginRepository.crear({
      username,
      confirmPassword: plainKey,
      fechaExpiracion: new Date(Date.now() + 300000),
      sessionToken: v4(),
      ipAddress: ip,
      userAgent: userAgent,
    });

    return plainKey;
  }

  async refresh(oldRefreshToken: string): Promise<ResponseAPI> {
    const response = await this.dataSource.transaction<ResponseAPI>(
      async (manager) => {
        const usuarioRefreshTokenRepository =
          this.usuarioRefreshTokenRepositoryInyectado.setTransactionManager(
            manager,
          );
        const usuarioRepository =
          this.usuarioRepoInyectado.setTransactionManager(manager);

        logger.verbose("=====REFRESH=====");
        const decoded = this.refreshJwtService.verify(
          oldRefreshToken,
        ) as RefreshInfoToken;

        logger.info("Token decodificado correctamente");
        if (!decoded.codigo) {
          throw new CustomError({
            statusCode: HttpStatusCode.UNAUTHORIZED,
            message: "Token inválido",
          });
        }

        logger.info("Buscando token en BD");
        const tokenDb =
          await usuarioRefreshTokenRepository.obtenerPorToken(oldRefreshToken);
        logger.info("Token encontrado en BD");

        if (!tokenDb || tokenDb.fechaExpiracion < new Date()) {
          throw new CustomError({
            statusCode: HttpStatusCode.UNAUTHORIZED,
            message: "Sesión expirada o inválida",
          });
        }

        logger.info("Borrando el anterior refresh token");
        await usuarioRefreshTokenRepository.eliminarPorId(tokenDb.id);
        logger.info("Refresh token eliminado correctamente");

        logger.info("Obteniendo usuario por id...");
        const usuario = await usuarioRepository.getUsuarioPorId(
          decoded.idUsuario,
        );
        logger.info("Usuario obtenido correctamente");

        logger.info("Construyendo usuario info token...");
        const usuarioInfoToken = BuildUtil.buildUsuarioInfoToken(usuario!);
        logger.info("Usuario info token construido correctamente");

        const newAccessToken = this.accessJwtService.sign(usuarioInfoToken);
        logger.info("Nuevo access token construido correctamente");

        const Nuevocodigo = BuildUtil.buildRandomEnRango(
          100000,
          999999,
        ).toString();
        const tokens = this.generateTokens(usuarioInfoToken, {
          idUsuario: usuario!.id,
          codigo: Nuevocodigo,
        });

        await usuarioRefreshTokenRepository.create({
          idUsuario: usuario!.id,
          codigo: decoded.codigo,
          refreshToken: tokens.refreshToken,
          fechaExpiracion: this.getRefreshTokenExpiration(),
        });

        return {
          message: "Token renovado",
          data: { accessToken: newAccessToken },
        };
      },
    );
    return response;
  }

  private generateTokens(
    usuarioInfo: UsuarioInfoToken,
    refreshInfo: RefreshInfoToken,
  ): TokensInterface {
    const accessToken = this.accessJwtService.sign(usuarioInfo);
    const refreshToken = this.refreshJwtService.sign(refreshInfo);

    return {
      accessToken,
      refreshToken,
    };
  }

  private getRefreshTokenExpiration(): Date {
    return DateUtil.addTimeToCurrentDate(
      process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    );
  }
}
