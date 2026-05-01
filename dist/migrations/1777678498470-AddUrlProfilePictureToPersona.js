"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUrlProfilePictureToPersona1777678498470 = void 0;
class AddUrlProfilePictureToPersona1777678498470 {
    name = "AddUrlProfilePictureToPersona1777678498470";
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."ts_persona" ADD "url_profile_picture" character varying`);
        await queryRunner.query(`ALTER TABLE "kafka_requests"."registrar_usuario" ALTER COLUMN "fecha" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "kafka_requests"."login_usuario" ALTER COLUMN "fecha" SET DEFAULT now()`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "kafka_requests"."login_usuario" ALTER COLUMN "fecha" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "kafka_requests"."registrar_usuario" ALTER COLUMN "fecha" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "core"."ts_persona" DROP COLUMN "url_profile_picture"`);
    }
}
exports.AddUrlProfilePictureToPersona1777678498470 = AddUrlProfilePictureToPersona1777678498470;
