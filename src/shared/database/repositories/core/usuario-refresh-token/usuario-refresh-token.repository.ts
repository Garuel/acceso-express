import { inject, singleton } from "tsyringe";
import {
  DataSource,
  DeleteResult,
  EntityManager,
  Repository,
  UpdateResult,
} from "typeorm";
import { UsuarioRefreshTokenEntity } from "../../../entities/core/usuario-refresh-token.entity";
import { UsuarioRefreshTokenInsert } from "./model-queries/usuario-refresh-token.insert";
import { UsuarioRefreshTokenUpdate } from "./model-queries/usuario-refresh-token.update";

@singleton()
export class UsuarioRefreshTokenRepository {
  private repo: Repository<UsuarioRefreshTokenEntity>;
  constructor(
    @inject(DataSource)
    private readonly connection: DataSource,
  ) {
    this.repo = this.connection.getRepository(UsuarioRefreshTokenEntity);
  }

  setTransactionManager(manager: EntityManager) {
    const nuevoRepo = new UsuarioRefreshTokenRepository(this.connection);
    nuevoRepo.repo = manager.getRepository(UsuarioRefreshTokenEntity);
    return nuevoRepo;
  }

  create(data: UsuarioRefreshTokenInsert): Promise<UsuarioRefreshTokenEntity> {
    return this.repo.save(this.repo.create(data));
  }

  insertar(data: UsuarioRefreshTokenInsert[]) {
    return this.repo.insert(data);
  }

  update(
    id: number,
    usuarioUpdate: UsuarioRefreshTokenUpdate,
  ): Promise<UpdateResult> {
    return this.repo
      .createQueryBuilder()
      .update()
      .set(usuarioUpdate)
      .where("id = :id", { id })
      .execute();
  }

  obtenerPorToken(
    refreshToken: string,
  ): Promise<UsuarioRefreshTokenEntity | null> {
    return this.repo
      .createQueryBuilder("usuarioRefreshToken")
      .select([
        "usuarioRefreshToken.id",
        "usuarioRefreshToken.idUsuario",
        "usuarioRefreshToken.refreshToken",
        "usuarioRefreshToken.fechaExpiracion",
        "usuarioRefreshToken.fechaUso",
      ])
      .where("usuarioRefreshToken.refreshToken = :refreshToken", {
        refreshToken,
      })
      .getOne();
  }

  eliminarPorId(id: number): Promise<DeleteResult> {
    return this.repo
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();
  }

  marcarComoUsado(id: number): Promise<UpdateResult> {
    return this.repo
      .createQueryBuilder()
      .update()
      .set({ fechaUso: new Date() })
      .where("id = :id", { id })
      .execute();
  }

  eliminarTodosLosTokensDelUsuario(idUsuario: number) {
    return this.repo
      .createQueryBuilder()
      .delete()
      .where("idUsuario = :idUsuario", { idUsuario })
      .execute();
  }
}
