import { Schema, model, Document } from "mongoose";

export interface IAuditoria extends Document {
    usuario: string;
    accion: string;
    ip: string;
    userAgent: string;
    detalles?: Record<string, any>
    createdAt: Date
}

const AuditoriaSchema = new Schema<IAuditoria>(
    {
        usuario: { type: String, required: true, index: true },
        accion: { type: String, required: true, index: true },
        ip: { type: String, required: true },
        userAgent: { type: String, required: true },
        detalles: { type: Schema.Types.Mixed, default: {} }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false
    }
);

export const AuditoriaModel = model<IAuditoria>('Auditoria', AuditoriaSchema, 'auditorias');