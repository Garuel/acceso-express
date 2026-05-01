"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIdempotenciaRepository = void 0;
class RequestIdempotenciaRepository {
    entityTarget;
    repo;
    constructor(entityTarget, connection) {
        this.entityTarget = entityTarget;
        this.repo = connection.getRepository(this.entityTarget);
    }
    setTransactionManager(manager) {
        this.repo = manager.getRepository(this.entityTarget);
        return this;
    }
    crear(data) {
        return this.repo.save(this.repo.create(data));
    }
    async insertar(data, primaryColumn = "id") {
        const insertResult = await this.repo
            .createQueryBuilder()
            .insert()
            .values(data)
            .execute();
        return insertResult.generatedMaps.map((e) => e[primaryColumn]);
    }
    existe(uuid) {
        return this.repo
            .createQueryBuilder("d")
            .where("d.uuid = :uuid", { uuid })
            .getExists();
    }
}
exports.RequestIdempotenciaRepository = RequestIdempotenciaRepository;
