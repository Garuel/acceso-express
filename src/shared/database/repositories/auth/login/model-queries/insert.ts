export interface LoginInsert {
  username: string;
  confirmPassword: string;
  fechaExpiracion: Date;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
}
