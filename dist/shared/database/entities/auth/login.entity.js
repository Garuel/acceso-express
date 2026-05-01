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
exports.LoginEntity = void 0;
const typeorm_1 = require("typeorm");
let LoginEntity = class LoginEntity {
    id;
    username;
    confirmPassword;
    fechaExpiracion;
    sessionToken;
    ipAddress;
    userAgent;
};
exports.LoginEntity = LoginEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], LoginEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], LoginEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "confirm_password",
        type: "varchar",
        length: 100,
    }),
    __metadata("design:type", Object)
], LoginEntity.prototype, "confirmPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "fecha_expiracion",
        type: "date",
    }),
    __metadata("design:type", Date)
], LoginEntity.prototype, "fechaExpiracion", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        name: "session_token",
        type: "varchar",
    }),
    __metadata("design:type", String)
], LoginEntity.prototype, "sessionToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ip_address", nullable: true }),
    __metadata("design:type", String)
], LoginEntity.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_agent", nullable: true }),
    __metadata("design:type", String)
], LoginEntity.prototype, "userAgent", void 0);
exports.LoginEntity = LoginEntity = __decorate([
    (0, typeorm_1.Entity)({
        schema: "auth",
        name: "tp_login",
    }),
    (0, typeorm_1.Index)(["username", "ipAddress"])
], LoginEntity);
