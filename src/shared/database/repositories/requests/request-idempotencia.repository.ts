import { DataSource, EntityManager, ObjectLiteral, Repository } from "typeorm";
import { RequestIdempotenciaInsert } from "../../../domain/interfaces/request-idempotencia-insert.interface";

export abstract class RequestIdempotenciaRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  constructor(
    private readonly entityTarget: new () => T,
    connection: DataSource | EntityManager,
  ) {
    this.repo = connection.getRepository(this.entityTarget);
  }

  setTransactionManager(manager: EntityManager) {
    this.repo = manager.getRepository(this.entityTarget);
    return this;
  }

  crear(data: RequestIdempotenciaInsert): Promise<T> {
    return this.repo.save(this.repo.create(data as unknown as T));
  }

  async insertar(
    data: RequestIdempotenciaInsert[],
    primaryColumn = "id",
  ): Promise<number[]> {
    const insertResult = await this.repo
      .createQueryBuilder()
      .insert()
      .values(data as any)
      .execute();
    return insertResult.generatedMaps.map((e: any) => e[primaryColumn]);
  }

  existe(uuid: string): Promise<boolean> {
    return this.repo
      .createQueryBuilder("d")
      .where("d.uuid = :uuid", { uuid })
      .getExists();
  }
}
