import { UsuarioInfoToken } from "../../modules/auth/dto/login.dto";
import { JwtService } from "../../modules/jwt/jwt.service";

export class AuthGuard {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(req: any): Promise<boolean> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) return false;

      const token = authHeader.split(" ")[1];
      const decoded = this.jwtService.verify(token);

      req.user = decoded as UsuarioInfoToken;
      return true;
    } catch (error) {
      return false;
    }
  }
}
