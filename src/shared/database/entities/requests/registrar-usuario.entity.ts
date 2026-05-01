import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({
  schema: "kafka_requests",
  name: "registrar_usuario",
})
export class RegistrarUsuarioRequestEntity {
  @PrimaryColumn({ type: "uuid" })
  uuid!: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha!: Date;
}
