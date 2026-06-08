import { hash } from "bcrypt";
import { singleton } from "tsyringe";
import { DataSource } from "typeorm";
import { v4 } from "uuid";
import { LoginRepository } from "../../../../../shared/database/repositories/auth/login/login.repository";
import { PersonaRepository } from "../../../../../shared/database/repositories/core/persona/persona.repository";
import { UsuarioRepository } from "../../../../../shared/database/repositories/core/usuario/usuario.repository";
import { RegistrarUsuarioRequestRepository } from "../../../../../shared/database/repositories/requests/registrar-usuario/registrar-usuario-repository";
import { CustomError } from "../../../../../shared/domain/classes/custom-error.class";
import { HttpStatusCode } from "../../../../../shared/domain/enum/custom-error.enum";
import { EstadoUsuarioEnum } from "../../../../../shared/domain/enum/estado-usuario.enum";
import { ResponseAPI } from "../../../../../shared/domain/interfaces/response.interface";
import { RedisService } from "../../../../../shared/infrastructure/cache/redis.service";
import { logger } from "../../../../../shared/infrastructure/utils/logger.util";
import { TokensInterface } from "../../../interface/token.interface";
import { AuthUtil } from "../../../util/autil.util";
import { ValidateUtil } from "../../../util/validate.util";
import { RegisterDto } from "./dto/register.dto";

@singleton()
export class RegisterUseCase {
    constructor(
        private readonly dataSource: DataSource,
        private readonly usuarioRepoInyectado: UsuarioRepository,
        private readonly loginRepoInyectado: LoginRepository,
        private readonly personaRepoInyectado: PersonaRepository,
        private readonly registrarUsuarioRepoInyectado: RegistrarUsuarioRequestRepository,
        private readonly redisService: RedisService,
    ) { }

    async execute(request: RegisterDto): Promise<ResponseAPI> {
        logger.verbose("=====REGISTER=====");


        const cacheKey = `idempotency:register:${request.rqUUID}`;
        const existeEnRedis = await this.redisService.get(cacheKey);
        if (existeEnRedis) {
            throw new CustomError({
                statusCode: HttpStatusCode.CONFLICT,
                titulo: "Petición en proceso o atendida",
                message: "La petición de registro ya fue procesada (Redis Cache)",
            });
        }

        await this.redisService.set(cacheKey, "true", 300);


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

}