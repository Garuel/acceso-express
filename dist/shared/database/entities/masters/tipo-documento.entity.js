"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoDocumentoEntity = void 0;
const typeorm_1 = require("typeorm");
const auditoria_entity_1 = require("../base/auditoria.entity");
const persona_entity_1 = require("../core/persona.entity");
let TipoDocumentoEntity = class TipoDocumentoEntity extends auditoria_entity_1.BaseAuditoriaEntity {
    id;
    nombre;
    personas;
};
exports.TipoDocumentoEntity = TipoDocumentoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], TipoDocumentoEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
    }),
    __metadata("design:type", String)
], TipoDocumentoEntity.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => persona_entity_1.PersonaEntity, (persona) => persona.tipoDocumento),
    __metadata("design:type", Array)
], TipoDocumentoEntity.prototype, "personas", void 0);
exports.TipoDocumentoEntity = TipoDocumentoEntity = __decorate([
    (0, typeorm_1.Entity)({
        schema: "masters",
        name: "tm_tipo_documento",
    })
], TipoDocumentoEntity);
