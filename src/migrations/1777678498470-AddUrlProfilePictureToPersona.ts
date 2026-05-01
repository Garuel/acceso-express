import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlProfilePictureToPersona1777678498470 implements MigrationInterface {
  name = "AddUrlProfilePictureToPersona1777678498470";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."ts_persona" ADD "url_profile_picture" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "kafka_requests"."registrar_usuario" ALTER COLUMN "fecha" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "kafka_requests"."login_usuario" ALTER COLUMN "fecha" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kafka_requests"."login_usuario" ALTER COLUMN "fecha" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "kafka_requests"."registrar_usuario" ALTER COLUMN "fecha" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."ts_persona" DROP COLUMN "url_profile_picture"`,
    );
  }
}
