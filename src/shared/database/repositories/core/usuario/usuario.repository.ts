import {
  DataSource,
  EntityManager,
  InsertResult,
  Repository,
  UpdateResult,
} from "typeorm";
import { UsuarioEntity } from "../../../entities/core/usuario.entity";
import { UsuarioInsert } from "./model-queries/insert";
import { UsuarioUpdate } from "./model-queries/update";
import { singleton, inject } from "tsyringe";

@singleton()
export class UsuarioRepository {
  private repo: Repository<UsuarioEntity>;

  constructor(
    @inject(DataSource)
    private readonly connection: DataSource,
  ) {
    this.repo = this.connection.getRepository(UsuarioEntity);
  }

  setTransactionManager(manager: EntityManager) {
    this.repo = manager.getRepository(UsuarioEntity);
    return this;
  }

  create(data: UsuarioInsert): Promise<UsuarioEntity> {
    return this.repo.save(this.repo.create(data));
  }
  update(id: number, usuarioUpdate: UsuarioUpdate): Promise<UpdateResult> {
    return this.repo
      .createQueryBuilder()
      .update()
      .set(usuarioUpdate)
      .where("id = :id", { id })
      .execute();
  }

  insert(data: UsuarioInsert[]): Promise<InsertResult> {
    return this.repo.createQueryBuilder().insert().values(data).execute();
  }

  async existeUsuario(username: string): Promise<boolean> {
    const usuarioResult = await this.repo
      .createQueryBuilder("usuario")
      .select(["usuario.id"])
      .where("LOWER(usuario.username) = :username", {
        username: username.toLowerCase(),
      })
      .getExists();

    return usuarioResult;
  }

  private getUsuarioBaseQuery() {
    return this.repo
      .createQueryBuilder("usuario")
      .select([
        "usuario.id",
        "usuario.username",
        "usuario.password",
        "usuario.idPersona",
        "usuario.idEstado",
        "usuario.publicKey",
        "usuario.intentosFallidos",
        "usuario.fechaCreacion",
        "usuario.fechaModificacion",
        "persona.nombres",
        "persona.apellidoPaterno",
        "persona.apellidoMaterno",
        "persona.numeroDocumento",
        "persona.numeroTelefono",
        "persona.idTipoDocumento",
        "persona.email",
        "estado.id",
        "estado.descripcion",
        "tipoDocumento.id",
        "tipoDocumento.nombre",
      ])
      .innerJoin("usuario.persona", "persona")
      .innerJoin("usuario.estado", "estado")
      .innerJoin("persona.tipoDocumento", "tipoDocumento");
  }

  private getUsuarioDataPorUsernameQuery(username: string) {
    return this.getUsuarioBaseQuery().where(
      "LOWER(usuario.username) = :username",
      {
        username: username.toLowerCase(),
      },
    );
  }

  async getUsuarioPorUsername(username: string): Promise<UsuarioEntity | null> {
    return this.getUsuarioDataPorUsernameQuery(username).getOne();
  }

  async getUsuarioPorId(id: number): Promise<UsuarioEntity | null> {
    return this.getUsuarioBaseQuery()
      .where("usuario.id = :id", { id })
      .getOne();
  }
}
