import { BaseAuditoriaInsert } from "../../../../../domain/interfaces/base-auditoria.interface";

export interface PersonaInsert extends BaseAuditoriaInsert {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  numeroDocumento: string;
  idTipoDocumento: number;
  email?: string;
  numeroTelefono?: string;
}
