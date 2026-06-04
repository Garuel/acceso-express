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

// import { Request, Response, NextFunction } from "express";
// import { validate } from "class-validator";
// import { plainToInstance } from "class-transformer";
// import { CustomError } from "../domain/classes/custom-error.class";
// import { HttpStatusCode } from "../domain/enum/custom-error.enum";
// import { TipoRespuestaEnum } from "../domain/enum/tipo-alerta.enum";

// export const ValidationMiddleware = (dtoClass: any) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     // 1. Transformamos el body plano en una instancia de la clase DTO
//     const dtoInstance = plainToInstance(dtoClass, req.body);

//     // 2. Ejecutamos la validación
//     const errors = await validate(dtoInstance);

//     if (errors.length > 0) {
//       // 3. Mapeo recursivo de errores (por si hay errores anidados en la matriz)
//       const message = errors
//         .map((error) => {
//           if (error.constraints) {
//             return Object.values(error.constraints);
//           }
//           // Si el error es en una propiedad anidada (como dentro de la matriz)
//           if (error.children && error.children.length > 0) {
//             return error.children.map((child) =>
//               child.constraints ? Object.values(child.constraints) : []
//             );
//           }
//           return [];
//         })
//         .flat(2) // Aplanamos el array de arrays
//         .join(", ");

//       return next(
//         new CustomError({
//           message: `Error de validación: ${message}`,
//           statusCode: HttpStatusCode.BAD_REQUEST,
//           tipoRespuesta: TipoRespuestaEnum.Error,
//         })
//       );
//     }

//     // 4. Reemplazamos el body con la instancia validada y transformada
//     req.body = dtoInstance;
//     next();
//   };
// };
