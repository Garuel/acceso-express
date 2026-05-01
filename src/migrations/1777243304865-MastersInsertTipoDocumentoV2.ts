import { MigrationInterface, QueryRunner } from "typeorm";

export class MastersInsertTipoDocumentoV21777243304865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO masters.tm_tipo_documento 
        ("nombre")
        VALUES 
        ('DNI'),
        ('CE'),
        ('RUC'),
        ('Pasaporte'),
        ('Otros');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM masters.tm_tipo_documento 
        WHERE nombre IN ('DNI', 'CE', 'RUC', 'Pasaporte', 'Otros');
        `);
  }
}
