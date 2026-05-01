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
exports.UsuarioEntity = void 0;
const typeorm_1 = require("typeorm");
const auditoria_entity_1 = require("../base/auditoria.entity");
const persona_entity_1 = require("./persona.entity");
const estado_usuario_entity_1 = require("../masters/estado-usuario.entity");
const usuario_refresh_token_entity_1 = require("./usuario-refresh-token.entity");
let UsuarioEntity = class UsuarioEntity extends auditoria_entity_1.BaseAuditoriaEntity {
    id;
    username;
    password;
    idPersona;
    idEstado;
    publicKey;
    intentosFallidos;
    persona;
    estado;
    usuarioRefreshTokens;
};
exports.UsuarioEntity = UsuarioEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], UsuarioEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], UsuarioEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
    }),
    __metadata("design:type", Object)
], UsuarioEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "id_persona",
        type: "integer",
    }),
    __metadata("design:type", Number)
], UsuarioEntity.prototype, "idPersona", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "id_estado",
        type: "integer",
    }),
    __metadata("design:type", Number)
], UsuarioEntity.prototype, "idEstado", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "public_key",
        type: "varchar",
    }),
    __metadata("design:type", Object)
], UsuarioEntity.prototype, "publicKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "intentos_fallidos", default: 0 }),
    __metadata("design:type", Number)
], UsuarioEntity.prototype, "intentosFallidos", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => persona_entity_1.PersonaEntity, (persona) => persona.usuario),
    (0, typeorm_1.JoinColumn)({ name: "id_persona" }),
    __metadata("design:type", persona_entity_1.PersonaEntity)
], UsuarioEntity.prototype, "persona", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estado_usuario_entity_1.EstadoUsuarioEntity, (estado) => estado.usuarios),
    (0, typeorm_1.JoinColumn)({ name: "id_estado" }),
    __metadata("design:type", estado_usuario_entity_1.EstadoUsuarioEntity)
], UsuarioEntity.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_refresh_token_entity_1.UsuarioRefreshTokenEntity, (refresh) => refresh.usuario),
    __metadata("design:type", Array)
], UsuarioEntity.prototype, "usuarioRefreshTokens", void 0);
exports.UsuarioEntity = UsuarioEntity = __decorate([
    (0, typeorm_1.Entity)({
        schema: "core",
        name: "tp_usuario",
    })
], UsuarioEntity);
