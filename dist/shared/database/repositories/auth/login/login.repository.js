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
exports.LoginRepository = void 0;
const typeorm_1 = require("typeorm");
const login_entity_1 = require("../../../entities/auth/login.entity");
const tsyringe_1 = require("tsyringe");
let LoginRepository = class LoginRepository {
    connection;
    repo;
    constructor(connection) {
        this.connection = connection;
        this.repo = this.connection.getRepository(login_entity_1.LoginEntity);
    }
    setTransactionManager(manager) {
        this.repo = manager.getRepository(login_entity_1.LoginEntity);
        return this;
    }
    crear(data) {
        return this.repo.save(this.repo.create(data));
    }
    eliminarPorUsername(username) {
        return this.repo
            .createQueryBuilder()
            .delete()
            .where("username = :username", { username })
            .execute();
    }
    actualizarPorUsername(username, confirmPassword) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + 15);
        return this.repo
            .createQueryBuilder()
            .update()
            .set({
            confirmPassword,
            fechaExpiracion: now,
        })
            .where("username = :username", { username })
            .execute();
    }
    actualizarSession(username, sessionToken) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + 15);
        return this.repo
            .createQueryBuilder()
            .update()
            .set({
            sessionToken,
            fechaExpiracion: now,
        })
            .where("username = :username", { username })
            .execute();
    }
    obtenerPorUsername(username) {
        return this.repo
            .createQueryBuilder("login")
            .select([
            "login.confirmPassword",
            "login.fechaExpiracion",
            "login.sessionToken",
        ])
            .where("login.username = :username", { username })
            .getOne();
    }
};
exports.LoginRepository = LoginRepository;
exports.LoginRepository = LoginRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LoginRepository);
