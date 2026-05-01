import {
  DataSource,
  EntityManager,
  InsertResult,
  Repository,
  UpdateResult,
} from "typeorm";
import { PersonaEntity } from "../../../entities/core/persona.entity";
import { PersonaInsert } from "./model-queries/insert";
import { PersonaUpdate } from "./model-queries/update";
import { singleton, inject } from "tsyringe";

@singleton()
export class PersonaRepository {
  private repo: Repository<PersonaEntity>;

  constructor(
    @inject(DataSource)
    private readonly connection: DataSource,
  ) {
    this.repo = this.connection.getRepository(PersonaEntity);
  }

  setTransactionManager(manager: EntityManager) {
    this.repo = manager.getRepository(PersonaEntity);
    return this;
  }

  create(data: PersonaInsert): Promise<PersonaEntity> {
    return this.repo.save(this.repo.create(data));
  }

  update(id: number, personaUpdate: PersonaUpdate): Promise<UpdateResult> {
    return this.repo
      .createQueryBuilder()
      .update()
      .set(personaUpdate)
      .where("id = :id", { id })
      .execute();
  }

  insert(data: PersonaInsert[]): Promise<InsertResult> {
    return this.repo.createQueryBuilder().insert().values(data).execute();
  }

  private getPersonaBaseQuery() {
    return this.repo
      .createQueryBuilder("persona")
      .select([
        "persona.id",
        "persona.nombres",
        "persona.apellidoPaterno",
        "persona.apellidoMaterno",
        "persona.numeroDocumento",
        "persona.idTipoDocumento",
        "persona.numeroTelefono",
        "persona.email",
        "persona.fechaCreacion",
        "persona.fechaModificacion",
      ]);
  }

  async existePersonaPorNumeroDocumento(
    numeroDocumento: string,
  ): Promise<boolean> {
    const personaResult = await this.getPersonaBaseQuery()
      .where("persona.numeroDocumento = :numeroDocumento", {
        numeroDocumento,
      })
      .getOne();
    return personaResult !== null && personaResult !== undefined;
  }

  async existePersonaPorEmail(email: string): Promise<boolean> {
    const personaResult = await this.getPersonaBaseQuery()
      .where("persona.email = :email", { email })
      .getOne();
    return personaResult !== null && personaResult !== undefined;
  }

  async getPersonaPorNumeroDocumento(
    numeroDocumento: string,
  ): Promise<PersonaEntity | null> {
    return this.getPersonaBaseQuery()
      .where("persona.numeroDocumento = :numeroDocumento", {
        numeroDocumento,
      })
      .getOne();
  }

  async getPersonaPorEmail(email: string): Promise<PersonaEntity | null> {
    return this.getPersonaBaseQuery()
      .where("persona.email = :email", { email })
      .getOne();
  }
}
