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
exports.PersonaEntity = void 0;
const auditoria_entity_1 = require("../base/auditoria.entity");
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const tipo_documento_entity_1 = require("../masters/tipo-documento.entity");
let PersonaEntity = class PersonaEntity extends auditoria_entity_1.BaseAuditoriaEntity {
    id;
    nombres;
    apellidoPaterno;
    apellidoMaterno;
    numeroDocumento;
    idTipoDocumento;
    email;
    numeroTelefono;
    urlProfilePicture;
    usuario;
    tipoDocumento;
};
exports.PersonaEntity = PersonaEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], PersonaEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "apellido_paterno",
        type: "varchar",
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "apellidoPaterno", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "apellido_materno",
        type: "varchar",
        nullable: true,
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "apellidoMaterno", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "numero_documento",
        type: "varchar",
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "numeroDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "id_tipo_documento",
        type: "integer",
    }),
    __metadata("design:type", Number)
], PersonaEntity.prototype, "idTipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "numero_telefono",
        type: "varchar",
        nullable: true,
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "numeroTelefono", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "url_profile_picture",
        type: "varchar",
        nullable: true,
    }),
    __metadata("design:type", String)
], PersonaEntity.prototype, "urlProfilePicture", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => usuario_entity_1.UsuarioEntity, (usuario) => usuario.persona),
    __metadata("design:type", usuario_entity_1.UsuarioEntity)
], PersonaEntity.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_documento_entity_1.TipoDocumentoEntity, (tipoDocumento) => tipoDocumento.personas),
    (0, typeorm_1.JoinColumn)({ name: "id_tipo_documento" }),
    __metadata("design:type", tipo_documento_entity_1.TipoDocumentoEntity)
], PersonaEntity.prototype, "tipoDocumento", void 0);
exports.PersonaEntity = PersonaEntity = __decorate([
    (0, typeorm_1.Entity)({
        schema: "core",
        name: "ts_persona",
    })
], PersonaEntity);
