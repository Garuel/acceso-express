export interface ValidateResult<T = {}> {
  esValido: boolean;
  estado?: string;
  statusCode?: number;
  mensaje?: string;
  extra?: T;
}
