import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseAuditoriaEntity } from "../base/auditoria.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({
  schema: "core",
  name: "tp_usuario_refresh_token",
})
export class UsuarioRefreshTokenEntity extends BaseAuditoriaEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ name: "id_usuario" })
  idUsuario!: number;

  @Column({ name: "refresh_token" })
  refreshToken!: string;

  @Column({ name: "fecha_expiracion" })
  fechaExpiracion!: Date;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.usuarioRefreshTokens)
  @JoinColumn({ name: "id_usuario" })
  usuario!: UsuarioEntity;
}
