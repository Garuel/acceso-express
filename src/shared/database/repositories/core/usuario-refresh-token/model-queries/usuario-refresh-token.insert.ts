export interface UsuarioRefreshTokenInsert {
  idUsuario: number;
  codigo: string;
  refreshToken: string;
  fechaExpiracion: Date;
}
