import { singleton } from "tsyringe";
import { ResponseAPI } from "../../../../../shared/domain/interfaces/response.interface";
import { DataSource } from "typeorm";
import { UsuarioRepository } from "../../../../../shared/database/repositories/core/usuario/usuario.repository";
import { UsuarioRefreshTokenRepository } from "../../../../../shared/database/repositories/core/usuario-refresh-token/usuario-refresh-token.repository";
import { TokensInterface } from "../../../interface/token.interface";
import { logger } from "../../../../../shared/infrastructure/utils/logger.util";
import { RefreshInfoToken } from "../../../dto/login.dto";
import { CustomError } from "../../../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../../../shared/domain/enum/custom-error.enum";
import { ValidateUtil } from "../../../util/validate.util";
import { BuildUtil } from "../../../../../shared/infrastructure/utils/build.util";
import { TokenManagerService } from "../../services/token-manager.service";
import { AuthUtil } from "../../../util/autil.util";
import { JwtService } from "../../../../jwt/jwt.service";

@singleton()
export class RefreshTokenUseCase {
    constructor(
        private readonly dataSource: DataSource,
        private readonly tokenManagerService: TokenManagerService,
        private readonly usuarioRepoInyectado: UsuarioRepository,
        private readonly usuarioRefreshTokenRepositoryInyectado: UsuarioRefreshTokenRepository,
        private readonly accessJwtService: JwtService,
        private readonly refreshJwtService: JwtService,
    ) { }

    async execute(oldRefreshToken: string): Promise<ResponseAPI<TokensInterface>> {
        const response = await this.dataSource.transaction<
            ResponseAPI<TokensInterface>
        >(async (manager) => {
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

            const controlGracia = await ValidateUtil.validarTiempoDeGracia(
                tokenDb,
                usuarioRepository,
                usuarioRefreshTokenRepository,
                this.accessJwtService,
                decoded.idUsuario
            );

            if (controlGracia.esConcurrente && controlGracia.tokens) {
                return {
                    message: "Token renovado (Concurrencia)",
                    data: {
                        accessToken: controlGracia.tokens.accessToken!,
                        refreshToken: controlGracia.tokens.refreshToken!,
                    },
                };
            }

            logger.info("Marcando refresh token anterior como usado en BD");
            await usuarioRefreshTokenRepository.marcarComoUsado(tokenDb.id);

            logger.info("Obteniendo usuario por id...");
            const usuario = await usuarioRepository.getUsuarioPorId(
                decoded.idUsuario,
            );
            logger.info("Usuario obtenido correctamente");

            logger.info("Construyendo usuario info token...");
            const usuarioInfoToken = BuildUtil.buildUsuarioInfoToken(usuario!);
            logger.info("Usuario info token construido correctamente");


            const nuevocodigo = BuildUtil.buildRandomEnRango(
                100000,
                999999,
            ).toString();
            const tokens = this.tokenManagerService.generateTokens(usuarioInfoToken, {
                idUsuario: usuario!.id,
                codigo: nuevocodigo,
            });

            await usuarioRefreshTokenRepository.create({
                idUsuario: usuario!.id,
                codigo: nuevocodigo,
                refreshToken: tokens.refreshToken,
                fechaExpiracion: AuthUtil.getRefreshTokenExpiration(),
            });

            return {
                message: "Token renovado",
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            };
        });
        return response;
    }
}