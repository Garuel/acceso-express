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
exports.UsuarioRepository = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../../../entities/core/usuario.entity");
const tsyringe_1 = require("tsyringe");
let UsuarioRepository = class UsuarioRepository {
    connection;
    repo;
    constructor(connection) {
        this.connection = connection;
        this.repo = this.connection.getRepository(usuario_entity_1.UsuarioEntity);
    }
    setTransactionManager(manager) {
        this.repo = manager.getRepository(usuario_entity_1.UsuarioEntity);
        return this;
    }
    create(data) {
        return this.repo.save(this.repo.create(data));
    }
    update(id, usuarioUpdate) {
        return this.repo
            .createQueryBuilder()
            .update()
            .set(usuarioUpdate)
            .where("id = :id", { id })
            .execute();
    }
    insert(data) {
        return this.repo.createQueryBuilder().insert().values(data).execute();
    }
    async existeUsuario(username) {
        const usuarioResult = await this.repo
            .createQueryBuilder("usuario")
            .select(["usuario.id"])
            .where("LOWER(usuario.username) = :username", {
            username: username.toLowerCase(),
        })
            .getExists();
        return usuarioResult;
    }
    getUsuarioBaseQuery() {
        return this.repo
            .createQueryBuilder("usuario")
            .select([
            "usuario.id",
            "usuario.username",
            "usuario.password",
            "usuario.idPersona",
            "usuario.idEstado",
            "usuario.publicKey",
            "usuario.intentosFallidos",
            "usuario.fechaCreacion",
            "usuario.fechaModificacion",
            "persona.nombres",
            "persona.apellidoPaterno",
            "persona.apellidoMaterno",
            "persona.numeroDocumento",
            "persona.numeroTelefono",
            "persona.idTipoDocumento",
            "persona.email",
            "estado.id",
            "estado.descripcion",
            "tipoDocumento.id",
            "tipoDocumento.nombre",
        ])
            .innerJoin("usuario.persona", "persona")
            .innerJoin("usuario.estado", "estado")
            .innerJoin("persona.tipoDocumento", "tipoDocumento");
    }
    getUsuarioDataPorUsernameQuery(username) {
        return this.getUsuarioBaseQuery().where("LOWER(usuario.username) = :username", {
            username: username.toLowerCase(),
        });
    }
    async getUsuarioPorUsername(username) {
        return this.getUsuarioDataPorUsernameQuery(username).getOne();
    }
    async getUsuarioPorId(id) {
        return this.getUsuarioBaseQuery()
            .where("usuario.id = :id", { id })
            .getOne();
    }
};
exports.UsuarioRepository = UsuarioRepository;
exports.UsuarioRepository = UsuarioRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UsuarioRepository);
