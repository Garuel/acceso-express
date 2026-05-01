import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseAuditoriaEntity } from "../base/auditoria.entity";
import { PersonaEntity } from "./persona.entity";
import { EstadoUsuarioEntity } from "../masters/estado-usuario.entity";
import { UsuarioRefreshTokenEntity } from "./usuario-refresh-token.entity";

@Entity({
  schema: "core",
  name: "tp_usuario",
})
export class UsuarioEntity extends BaseAuditoriaEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 100 })
  username!: string;

  @Column({
    type: "varchar",
  })
  password!: string | null;

  @Column({
    name: "id_persona",
    type: "integer",
  })
  idPersona!: number;

  @Column({
    name: "id_estado",
    type: "integer",
  })
  idEstado!: number;

  @Column({
    name: "public_key",
    type: "varchar",
  })
  publicKey!: string | null;

  @Column({ name: "intentos_fallidos", default: 0 })
  intentosFallidos!: number;

  @OneToOne(() => PersonaEntity, (persona) => persona.usuario)
  @JoinColumn({ name: "id_persona" })
  persona!: PersonaEntity;

  @ManyToOne(() => EstadoUsuarioEntity, (estado) => estado.usuarios)
  @JoinColumn({ name: "id_estado" })
  estado!: EstadoUsuarioEntity;

  @OneToMany(() => UsuarioRefreshTokenEntity, (refresh) => refresh.usuario)
  usuarioRefreshTokens!: UsuarioRefreshTokenEntity[];
}
