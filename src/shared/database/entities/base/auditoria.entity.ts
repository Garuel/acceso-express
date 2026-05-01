import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseAuditoriaEntity {
  @CreateDateColumn({
    name: "fecha_creacion",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion?: Date;

  @UpdateDateColumn({
    name: "fecha_modificacion",
    type: "timestamp",
    nullable: true,
  })
  fechaModificacion?: Date | null;

  @Column({ name: "es_activo", type: "boolean", default: true })
  esActivo?: boolean;
}
