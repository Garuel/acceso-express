import { NextFunction, Request, Response } from "express";
import { AuthGuard } from "../guards/auth.guard";
import { CustomError } from "../domain/classes/custom-error.class";
import { HttpStatusCode } from "../domain/enum/custom-error.enum";

export const JtwAuthMiddleware =
  (authGuard: AuthGuard) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await authGuard.canActivate(req);

    if (!isAuthorized) {
      throw new CustomError({
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "No autorizado",
        titulo: "Unauthorized",
      });
    }

    next();
  };
