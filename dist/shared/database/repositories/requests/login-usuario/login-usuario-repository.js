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
exports.LoginUsuarioRequestRepository = void 0;
const typeorm_1 = require("typeorm");
const login_usuario_entity_1 = require("../../../entities/requests/login-usuario.entity");
const request_idempotencia_repository_1 = require("../request-idempotencia.repository");
const tsyringe_1 = require("tsyringe");
let LoginUsuarioRequestRepository = class LoginUsuarioRequestRepository extends request_idempotencia_repository_1.RequestIdempotenciaRepository {
    constructor(connection) {
        super(login_usuario_entity_1.LoginUsuarioRequestEntity, connection);
    }
};
exports.LoginUsuarioRequestRepository = LoginUsuarioRequestRepository;
exports.LoginUsuarioRequestRepository = LoginUsuarioRequestRepository = __decorate([
    __param(0, (0, tsyringe_1.inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [Object])
], LoginUsuarioRequestRepository);
