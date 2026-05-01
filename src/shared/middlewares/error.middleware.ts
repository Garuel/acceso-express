import { Request, Response, NextFunction } from "express";
import { CustomError } from "../domain/classes/custom-error.class";
import { HttpStatusCode } from "../domain/enum/custom-error.enum";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(
    `[${new Date().toISOString()}] ERROR en ${req.method} ${req.originalUrl}`,
  );
  console.error(err);

  if (err instanceof CustomError) {
    const errorData = err.toJSON();

    const clientMessage =
      errorData.statusCode >= 500
        ? "Algo salió mal, inténtalo más tarde"
        : errorData.message;

    return res.status(errorData.statusCode).json({
      ...errorData,
      message: clientMessage,
      contexto: `${req.method} ${req.originalUrl}`,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: "Error interno del servidor",
    titulo: "Error Inesperado",
    fecha: new Date().toISOString(),
  });
};
