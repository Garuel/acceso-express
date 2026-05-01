"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MastersInsertTipoDocumentoV21777243304865 = void 0;
class MastersInsertTipoDocumentoV21777243304865 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
        DELETE FROM masters.tm_tipo_documento 
        WHERE nombre IN ('DNI', 'CE', 'RUC', 'Pasaporte', 'Otros');
        `);
    }
}
exports.MastersInsertTipoDocumentoV21777243304865 = MastersInsertTipoDocumentoV21777243304865;
