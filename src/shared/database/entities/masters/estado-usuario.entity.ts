import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseAuditoriaEntity } from "../base/auditoria.entity";
import { UsuarioEntity } from "../core/usuario.entity";

@Entity({
  schema: "masters",
  name: "tm_estado_usuario",
})
export class EstadoUsuarioEntity extends BaseAuditoriaEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({
    type: "varchar",
    length: 50,
  })
  nombre!: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  descripcion!: string;

  @OneToMany(() => UsuarioEntity, (usuario) => usuario.estado)
  usuarios!: UsuarioEntity[];
}
