import { BaseAuditoriaEntity } from "../base/auditoria.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsuarioEntity } from "./usuario.entity";
import { TipoDocumentoEntity } from "../masters/tipo-documento.entity";

@Entity({
  schema: "core",
  name: "ts_persona",
})
export class PersonaEntity extends BaseAuditoriaEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({
    type: "varchar",
  })
  nombres!: string;

  @Column({
    name: "apellido_paterno",
    type: "varchar",
  })
  apellidoPaterno!: string;

  @Column({
    name: "apellido_materno",
    type: "varchar",
    nullable: true,
  })
  apellidoMaterno?: string;

  @Column({
    name: "numero_documento",
    type: "varchar",
  })
  numeroDocumento!: string;

  @Column({
    name: "id_tipo_documento",
    type: "integer",
  })
  idTipoDocumento!: number;

  @Column({
    type: "varchar",
  })
  email!: string;

  @Column({
    name: "numero_telefono",
    type: "varchar",
    nullable: true,
  })
  numeroTelefono?: string;

  @Column({
    name: "url_profile_picture",
    type: "varchar",
    nullable: true,
  })
  urlProfilePicture?: string;

  @OneToOne(() => UsuarioEntity, (usuario) => usuario.persona)
  usuario!: UsuarioEntity;

  @ManyToOne(
    () => TipoDocumentoEntity,
    (tipoDocumento) => tipoDocumento.personas,
  )
  @JoinColumn({ name: "id_tipo_documento" })
  tipoDocumento!: TipoDocumentoEntity;
}
