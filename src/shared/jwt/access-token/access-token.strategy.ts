import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import * as dotenv from "dotenv";

dotenv.config();

export class AccessTokenStrategy extends Strategy {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_ACCESS_SECRET as string,
      },
      (payload: { username: string }, done: VerifiedCallback) => {
        try {
          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      },
    );
  }

  validate(payload: { username: string }) {
    return payload;
  }
}
