"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialDatabase1777240689471 = void 0;
class InitialDatabase1777240689471 {
    name = "InitialDatabase1777240689471";
    async up(queryRunner) {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "core"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "masters"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "kafka_requests"`);
        await queryRunner.query(`CREATE TABLE "kafka_requests"."registrar_usuario" ("uuid" uuid NOT NULL, "fecha" TIMESTAMP NOT NULL, CONSTRAINT "PK_ed9476725196e3f99b2560e227b" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "masters"."tm_tipo_documento" ("fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP DEFAULT now(), "es_activo" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, CONSTRAINT "PK_abc59e6aa859f494e1d3b15dd5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."ts_persona" ("fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP DEFAULT now(), "es_activo" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, "nombres" character varying NOT NULL, "apellido_paterno" character varying NOT NULL, "apellido_materno" character varying, "numero_documento" character varying NOT NULL, "id_tipo_documento" integer NOT NULL, "email" character varying NOT NULL, "numero_telefono" character varying, CONSTRAINT "PK_56ec95125a7d255e79da98eb1a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."tp_usuario_refresh_token" ("fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP DEFAULT now(), "es_activo" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, "id_usuario" integer NOT NULL, "refresh_token" character varying NOT NULL, "fecha_expiracion" TIMESTAMP NOT NULL, CONSTRAINT "PK_70eecaf88654d3052af5c7708eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."tp_usuario" ("fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP DEFAULT now(), "es_activo" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "password" character varying NOT NULL, "id_persona" integer NOT NULL, "id_estado" integer NOT NULL, "public_key" character varying NOT NULL, "intentos_fallidos" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_fcaeabffcc2fe5d6a1c51dbe17" UNIQUE ("id_persona"), CONSTRAINT "PK_9fdb210df04367ee8f1afb7391e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "masters"."tm_estado_usuario" ("fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP DEFAULT now(), "es_activo" boolean NOT NULL DEFAULT true, "id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "descripcion" character varying(150) NOT NULL, CONSTRAINT "PK_3a964e6b9736cb8c4adf3a864e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kafka_requests"."login_usuario" ("uuid" uuid NOT NULL, "fecha" TIMESTAMP NOT NULL, CONSTRAINT "PK_0c1623a20a81e46e51f4ac88cfd" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "auth"."tp_login" ("id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "confirm_password" character varying(100) NOT NULL, "fecha_expiracion" date NOT NULL, "session_token" character varying NOT NULL, "ip_address" character varying, "user_agent" character varying, CONSTRAINT "PK_603ade3f7fbe3b847dcaecee261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d786d287126cb95d6237e2d70" ON "auth"."tp_login" ("session_token") `);
        await queryRunner.query(`CREATE INDEX "IDX_e82adcb5cb2621d8f404a252fd" ON "auth"."tp_login" ("username", "ip_address") `);
        await queryRunner.query(`ALTER TABLE "core"."ts_persona" ADD CONSTRAINT "FK_c14dddeabb41431d1a3d3f44db5" FOREIGN KEY ("id_tipo_documento") REFERENCES "masters"."tm_tipo_documento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario_refresh_token" ADD CONSTRAINT "FK_5a02fd6d105a080e17014156fe9" FOREIGN KEY ("id_usuario") REFERENCES "core"."tp_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario" ADD CONSTRAINT "FK_fcaeabffcc2fe5d6a1c51dbe174" FOREIGN KEY ("id_persona") REFERENCES "core"."ts_persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario" ADD CONSTRAINT "FK_6b0b8507b376934ce22dff2c044" FOREIGN KEY ("id_estado") REFERENCES "masters"."tm_estado_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario" DROP CONSTRAINT "FK_6b0b8507b376934ce22dff2c044"`);
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario" DROP CONSTRAINT "FK_fcaeabffcc2fe5d6a1c51dbe174"`);
        await queryRunner.query(`ALTER TABLE "core"."tp_usuario_refresh_token" DROP CONSTRAINT "FK_5a02fd6d105a080e17014156fe9"`);
        await queryRunner.query(`ALTER TABLE "core"."ts_persona" DROP CONSTRAINT "FK_c14dddeabb41431d1a3d3f44db5"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_e82adcb5cb2621d8f404a252fd"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_0d786d287126cb95d6237e2d70"`);
        await queryRunner.query(`DROP TABLE "auth"."tp_login"`);
        await queryRunner.query(`DROP TABLE "kafka_requests"."login_usuario"`);
        await queryRunner.query(`DROP TABLE "masters"."tm_estado_usuario"`);
        await queryRunner.query(`DROP TABLE "core"."tp_usuario"`);
        await queryRunner.query(`DROP TABLE "core"."tp_usuario_refresh_token"`);
        await queryRunner.query(`DROP TABLE "core"."ts_persona"`);
        await queryRunner.query(`DROP TABLE "masters"."tm_tipo_documento"`);
        await queryRunner.query(`DROP TABLE "kafka_requests"."registrar_usuario"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "auth" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "masters" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "core" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "kafka_requests" CASCADE`);
    }
}
exports.InitialDatabase1777240689471 = InitialDatabase1777240689471;
