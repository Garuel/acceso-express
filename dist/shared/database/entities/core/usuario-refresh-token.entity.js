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
exports.UsuarioRefreshTokenEntity = void 0;
const typeorm_1 = require("typeorm");
const auditoria_entity_1 = require("../base/auditoria.entity");
const usuario_entity_1 = require("./usuario.entity");
let UsuarioRefreshTokenEntity = class UsuarioRefreshTokenEntity extends auditoria_entity_1.BaseAuditoriaEntity {
    id;
    idUsuario;
    refreshToken;
    fechaExpiracion;
    usuario;
};
exports.UsuarioRefreshTokenEntity = UsuarioRefreshTokenEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], UsuarioRefreshTokenEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "id_usuario" }),
    __metadata("design:type", Number)
], UsuarioRefreshTokenEntity.prototype, "idUsuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "refresh_token" }),
    __metadata("design:type", String)
], UsuarioRefreshTokenEntity.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "fecha_expiracion" }),
    __metadata("design:type", Date)
], UsuarioRefreshTokenEntity.prototype, "fechaExpiracion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.UsuarioEntity, (usuario) => usuario.usuarioRefreshTokens),
    (0, typeorm_1.JoinColumn)({ name: "id_usuario" }),
    __metadata("design:type", usuario_entity_1.UsuarioEntity)
], UsuarioRefreshTokenEntity.prototype, "usuario", void 0);
exports.UsuarioRefreshTokenEntity = UsuarioRefreshTokenEntity = __decorate([
    (0, typeorm_1.Entity)({
        schema: "core",
        name: "tp_usuario_refresh_token",
    })
], UsuarioRefreshTokenEntity);
