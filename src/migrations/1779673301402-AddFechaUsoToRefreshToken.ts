import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFechaUsoToRefreshToken1779673301402 implements MigrationInterface {
    name = 'AddFechaUsoToRefreshToken1779673301402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario_refresh_token" ADD "fecha_uso" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario_refresh_token" DROP COLUMN "fecha_uso"`);
    }

}
