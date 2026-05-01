import { DataSource, EntityManager, Repository } from "typeorm";
import { LoginEntity } from "../../../entities/auth/login.entity";
import { LoginInsert } from "./model-queries/insert";
import { singleton, inject } from "tsyringe";

@singleton()
export class LoginRepository {
  private repo: Repository<LoginEntity>;

  constructor(
    @inject(DataSource)
    private readonly connection: DataSource,
  ) {
    this.repo = this.connection.getRepository(LoginEntity);
  }

  setTransactionManager(manager: EntityManager) {
    this.repo = manager.getRepository(LoginEntity);
    return this;
  }

  crear(data: LoginInsert): Promise<LoginEntity> {
    return this.repo.save(this.repo.create(data));
  }

  eliminarPorUsername(username: string) {
    return this.repo
      .createQueryBuilder()
      .delete()
      .where("username = :username", { username })
      .execute();
  }

  actualizarPorUsername(username: string, confirmPassword: string) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 15);

    return this.repo
      .createQueryBuilder()
      .update()
      .set({
        confirmPassword,
        fechaExpiracion: now,
      })
      .where("username = :username", { username })
      .execute();
  }

  actualizarSession(username: string, sessionToken: string) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 15);

    return this.repo
      .createQueryBuilder()
      .update()
      .set({
        sessionToken,
        fechaExpiracion: now,
      })
      .where("username = :username", { username })
      .execute();
  }

  obtenerPorUsername(username: string) {
    return this.repo
      .createQueryBuilder("login")
      .select([
        "login.confirmPassword",
        "login.fechaExpiracion",
        "login.sessionToken",
      ])
      .where("login.username = :username", { username })
      .getOne();
  }
}
