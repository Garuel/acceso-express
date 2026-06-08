import { DataSource } from "typeorm";

import { compare } from "bcrypt";
import { singleton } from "tsyringe";
import { LoginRepository } from "../../../../../shared/database/repositories/auth/login/login.repository";
import { UsuarioRefreshTokenRepository } from "../../../../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository";
import { UsuarioRepository } from "../../../../../shared/database/repositories/core/usuario/usuario.repository";
import { LoginUsuarioRequestRepository } from "../../../../../shared/database/repositories/requests/login-usuario/login-usuario-repository";
import { CustomError } from "../../../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../../../shared/domain/enum/custom-error.enum";
import { ResponseAPI } from "../../../../../shared/domain/interfaces/response.interface";
import { RedisService } from "../../../../../shared/infrastructure/cache/redis.service";
import { BuildUtil } from "../../../../../shared/infrastructure/utils/build.util";
import { logger } from "../../../../../shared/infrastructure/utils/logger.util";
import { LoginDto, RefreshInfoToken } from "../../../dto/login.dto";
import { TokensInterface } from "../../../interface/token.interface";
import { AuthUtil } from "../../../util/autil.util";
import { ValidateUtil } from "../../../util/validate.util";
import { TokenManagerService } from "../../services/token-manager.service";

@singleton()
export class LoginUseCase {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tokenManagerService: TokenManagerService,
        private readonly usuarioRepoInyectado: UsuarioRepository,
        private readonly loginRepoInyectado: LoginRepository,
        private readonly loginUsuarioRepoInyectado: LoginUsuarioRequestRepository,
        private readonly usuarioRefreshTokenRepositoryInyectado: UsuarioRefreshTokenRepository,
        private readonly redisService: RedisService,
    ) { }

    async execute(request: LoginDto): Promise<ResponseAPI<TokensInterface>> {
        const cacheKey = `idempotency:login:${request.rqUUID}`;

        const existeEnRedis = await this.redisService.get(cacheKey);
        if (existeEnRedis) {
            throw new CustomError({
                statusCode: HttpStatusCode.CONFLICT,
                titulo: "Petición en proceso o atendida",
                message: "La petición ya fue procesada recientemente (Redis Cache)",
            });
        }

        await this.redisService.set(cacheKey, "true", 300);


        const loginResponse = await this.dataSource.transaction<
            ResponseAPI<TokensInterface>
        >(async (manager) => {
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

            logger.info("generando código...");

            const codigo = BuildUtil.buildRandomEnRango(100000, 999999).toString();

            logger.info("Generando usuario info token...");
            const usuarioInfoToken = BuildUtil.buildUsuarioInfoToken(usuario!);

            const refreshInfo: RefreshInfoToken = {
                idUsuario: usuario!.id,
                codigo,
            };
            logger.info("generando tokens...");
            const tokens = this.tokenManagerService.generateTokens(usuarioInfoToken, refreshInfo);
            logger.info("Insertando rquuid...");
            await loginUsuarioRepository.insertar([
                { uuid: request.rqUUID, fecha: new Date() },
            ]);
            logger.info("Rquuid insertado");

            await usuarioRefreshTokenRepository.create({
                idUsuario: usuario!.id,
                codigo,
                refreshToken: tokens.refreshToken,
                fechaExpiracion: AuthUtil.getRefreshTokenExpiration(),
            });

            return {
                message: "Login exitoso",
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            };
        });
        return loginResponse;
    }
}