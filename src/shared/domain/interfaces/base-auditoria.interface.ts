export interface BaseAuditoriaInsert {
  esActivo?: boolean;
  fechaCreacion?: Date;
}

export interface BaseAuditoriaUpdate {
  fechaModificacion: Date | null;
  esActivo?: boolean;
}
