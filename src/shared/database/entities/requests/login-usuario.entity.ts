import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({
  schema: "kafka_requests",
  name: "login_usuario",
})
export class LoginUsuarioRequestEntity {
  @PrimaryColumn({ type: "uuid" })
  uuid!: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha!: Date;
}
