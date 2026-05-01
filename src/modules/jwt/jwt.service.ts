import * as jwt from "jsonwebtoken";

export class JwtService {
  constructor(
    private readonly secret: string,
    private readonly expires: string,
  ) {}

  sign(payload: any) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expires as any });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
