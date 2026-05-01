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
exports.PersonaRepository = void 0;
const typeorm_1 = require("typeorm");
const persona_entity_1 = require("../../../entities/core/persona.entity");
const tsyringe_1 = require("tsyringe");
let PersonaRepository = class PersonaRepository {
    connection;
    repo;
    constructor(connection) {
        this.connection = connection;
        this.repo = this.connection.getRepository(persona_entity_1.PersonaEntity);
    }
    setTransactionManager(manager) {
        this.repo = manager.getRepository(persona_entity_1.PersonaEntity);
        return this;
    }
    create(data) {
        return this.repo.save(this.repo.create(data));
    }
    update(id, personaUpdate) {
        return this.repo
            .createQueryBuilder()
            .update()
            .set(personaUpdate)
            .where("id = :id", { id })
            .execute();
    }
    insert(data) {
        return this.repo.createQueryBuilder().insert().values(data).execute();
    }
    getPersonaBaseQuery() {
        return this.repo
            .createQueryBuilder("persona")
            .select([
            "persona.id",
            "persona.nombres",
            "persona.apellidoPaterno",
            "persona.apellidoMaterno",
            "persona.numeroDocumento",
            "persona.idTipoDocumento",
            "persona.numeroTelefono",
            "persona.email",
            "persona.fechaCreacion",
            "persona.fechaModificacion",
        ]);
    }
    async existePersonaPorNumeroDocumento(numeroDocumento) {
        const personaResult = await this.getPersonaBaseQuery()
            .where("persona.numeroDocumento = :numeroDocumento", {
            numeroDocumento,
        })
            .getOne();
        return personaResult !== null && personaResult !== undefined;
    }
    async existePersonaPorEmail(email) {
        const personaResult = await this.getPersonaBaseQuery()
            .where("persona.email = :email", { email })
            .getOne();
        return personaResult !== null && personaResult !== undefined;
    }
    async getPersonaPorNumeroDocumento(numeroDocumento) {
        return this.getPersonaBaseQuery()
            .where("persona.numeroDocumento = :numeroDocumento", {
            numeroDocumento,
        })
            .getOne();
    }
    async getPersonaPorEmail(email) {
        return this.getPersonaBaseQuery()
            .where("persona.email = :email", { email })
            .getOne();
    }
};
exports.PersonaRepository = PersonaRepository;
exports.PersonaRepository = PersonaRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PersonaRepository);
