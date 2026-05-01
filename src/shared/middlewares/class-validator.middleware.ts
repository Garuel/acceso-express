import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../domain/classes/custom-error.class";
import { TipoRespuestaEnum } from "../domain/enum/tipo-alerta.enum";
import { HttpStatusCode } from "../domain/enum/custom-error.enum";

export const ValidationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance as Object);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints || {}))
        .join(", ");
      return next(
        new CustomError({
          message,
          statusCode: HttpStatusCode.BAD_REQUEST,
          tipoRespuesta: TipoRespuestaEnum.Error,
        }),
      );
    }

    req.body = dtoInstance;
    next();
  };
};
