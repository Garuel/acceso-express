"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MastersInsert11777240917241 = void 0;
class MastersInsert11777240917241 {
    name = "MastersInsert11777240917241";
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
        DELETE FROM masters.tm_estado_usuario 
        WHERE nombre IN ('Activo', 'BloqueadoTemporalmente', 'BloqueadoIndefinidamente', 'Deshabilitado');
        `);
    }
}
exports.MastersInsert11777240917241 = MastersInsert11777240917241;
