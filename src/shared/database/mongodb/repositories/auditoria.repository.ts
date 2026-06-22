import { logger } from "../../../infrastructure/utils/logger.util";
import { AuditoriaModel, IAuditoria } from "../models/auditoria.model";

export class AuditoriaRepository {
    private readonly auditoriaModel = AuditoriaModel;

    async save(data: Partial<IAuditoria>): Promise<void> {
        try {
            await this.auditoriaModel.create(data);
        } catch (error) {
            logger.error("Error al guardar auditoria: ", error);
        }
    }
}