import * as jwt from "jsonwebtoken";

export class JwtService {
  constructor(
    private readonly secretOrKey: string,
    private readonly expires: string,
    private readonly algorithm: "HS256" | "RS256" = "HS256"
  ) { }

  sign(payload: any) {
    return jwt.sign(payload, this.secretOrKey, {
      algorithm: this.algorithm,
      expiresIn: this.expires as any,
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.secretOrKey, {
      algorithms: [this.algorithm]
    });
  }
}
