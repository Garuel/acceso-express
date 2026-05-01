import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  schema: "auth",
  name: "tp_login",
})
@Index(["username", "ipAddress"])
export class LoginEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 100 })
  username!: string;

  @Column({
    name: "confirm_password",
    type: "varchar",
    length: 100,
  })
  confirmPassword!: string | null;

  @Column({
    name: "fecha_expiracion",
    type: "date",
  })
  fechaExpiracion!: Date;

  @Index()
  @Column({
    name: "session_token",
    type: "varchar",
  })
  sessionToken!: string;

  @Column({ name: "ip_address", nullable: true })
  ipAddress!: string;

  @Column({ name: "user_agent", nullable: true })
  userAgent!: string;
}
