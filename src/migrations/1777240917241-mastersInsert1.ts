import { MigrationInterface, QueryRunner } from "typeorm";

export class MastersInsert11777240917241 implements MigrationInterface {
  name = "MastersInsert11777240917241";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO masters.tm_estado_usuario 
        ("nombre", "descripcion")
        VALUES 
        ('Activo', 'Usuario activo'),
        ('BloqueadoTemporalmente', 'Usuario bloqueado temporalmente'),
        ('BloqueadoIndefinidamente', 'Usuario bloqueado indefinidamente'),
        ('Deshabilitado', 'Usuario deshabilitado');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM masters.tm_estado_usuario 
        WHERE nombre IN ('Activo', 'BloqueadoTemporalmente', 'BloqueadoIndefinidamente', 'Deshabilitado');
        `);
  }
}
