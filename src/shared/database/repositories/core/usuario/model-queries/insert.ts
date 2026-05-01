import { BaseAuditoriaInsert } from "../../../../../domain/interfaces/base-auditoria.interface";

export interface UsuarioInsert extends BaseAuditoriaInsert {
  readonly username: string;
  readonly password?: string;
  readonly idPersona: number;
  readonly idEstado?: number;
  readonly publicKey?: string;
  readonly intentosFallidos?: number;
}
