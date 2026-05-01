import { DataSource, EntityManager } from "typeorm";
import { RegistrarUsuarioRequestEntity } from "../../../entities/requests/registrar-usuario.entity";
import { RequestIdempotenciaRepository } from "../request-idempotencia.repository";

export class RegistrarUsuarioRequestRepository extends RequestIdempotenciaRepository<RegistrarUsuarioRequestEntity> {
  constructor(connection: DataSource | EntityManager) {
    super(RegistrarUsuarioRequestEntity, connection);
  }
}
