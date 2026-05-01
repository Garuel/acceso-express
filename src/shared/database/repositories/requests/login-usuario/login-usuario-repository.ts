import { DataSource, EntityManager } from "typeorm";
import { LoginUsuarioRequestEntity } from "../../../entities/requests/login-usuario.entity";
import { RequestIdempotenciaRepository } from "../request-idempotencia.repository";
import { inject } from "tsyringe";

export class LoginUsuarioRequestRepository extends RequestIdempotenciaRepository<LoginUsuarioRequestEntity> {
  constructor(
    @inject(DataSource)
    connection: DataSource | EntityManager,
  ) {
    super(LoginUsuarioRequestEntity, connection);
  }
}
