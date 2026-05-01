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
exports.EstadoUsuarioEntity = void 0;
const typeorm_1 = require("typeorm");
const auditoria_entity_1 = require("../base/auditoria.entity");
const usuario_entity_1 = require("../core/usuario.entity");
let EstadoUsuarioEntity = class EstadoUsuarioEntity extends auditoria_entity_1.BaseAuditoriaEntity {
    id;
    nombre;
    descripcion;
    usuarios;
};
exports.EstadoUsuarioEntity = EstadoUsuarioEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], EstadoUsuarioEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
    }),
    __metadata("design:type", String)
], EstadoUsuarioEntity.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 150,
    }),
    __metadata("design:type", String)
], EstadoUsuarioEntity.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_entity_1.UsuarioEntity, (usuario) => usuario.estado),
    __metadata("design:type", Array)
], EstadoUsuarioEntity.prototype, "usuarios", void 0);
exports.EstadoUsuarioEntity = EstadoUsuarioEntity = __decorate([
    (0, typeorm_1.Entity)({
        schema: "masters",
        name: "tm_estado_usuario",
    })
], EstadoUsuarioEntity);
