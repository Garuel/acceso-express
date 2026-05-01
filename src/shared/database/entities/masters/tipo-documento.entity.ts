import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseAuditoriaEntity } from "../base/auditoria.entity";
import { PersonaEntity } from "../core/persona.entity";

@Entity({
  schema: "masters",
  name: "tm_tipo_documento",
})
export class TipoDocumentoEntity extends BaseAuditoriaEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({
    type: "varchar",
    length: 50,
  })
  nombre!: string;

  @OneToMany(() => PersonaEntity, (persona) => persona.tipoDocumento)
  personas!: PersonaEntity[];
}
