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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRefreshTokenRepository = void 0;
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const usuario_refresh_token_entity_1 = require("../../../entities/core/usuario-refresh-token.entity");
let UsuarioRefreshTokenRepository = class UsuarioRefreshTokenRepository {
    connection;
    repo;
    constructor(connection) {
        this.connection = connection;
        this.repo = this.connection.getRepository(usuario_refresh_token_entity_1.UsuarioRefreshTokenEntity);
    }
    setTransactionManager(manager) {
        this.repo = manager.getRepository(usuario_refresh_token_entity_1.UsuarioRefreshTokenEntity);
        return this;
    }
    create(data) {
        return this.repo.save(this.repo.create(data));
    }
    insertar(data) {
        return this.repo.insert(data);
    }
    update(id, usuarioUpdate) {
        return this.repo
            .createQueryBuilder()
            .update()
            .set(usuarioUpdate)
            .where("id = :id", { id })
            .execute();
    }
    obtenerPorToken(refreshToken) {
        return this.repo
            .createQueryBuilder("usuarioRefreshToken")
            .select([
            "usuarioRefreshToken.id",
            "usuarioRefreshToken.idUsuario",
            "usuarioRefreshToken.refreshToken",
            "usuarioRefreshToken.fechaExpiracion",
        ])
            .where("usuarioRefreshToken.refreshToken = :refreshToken", {
            refreshToken,
        })
            .getOne();
    }
    eliminarPorId(id) {
        return this.repo
            .createQueryBuilder()
            .delete()
            .where("id = :id", { id })
            .execute();
    }
};
exports.UsuarioRefreshTokenRepository = UsuarioRefreshTokenRepository;
exports.UsuarioRefreshTokenRepository = UsuarioRefreshTokenRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UsuarioRefreshTokenRepository);
