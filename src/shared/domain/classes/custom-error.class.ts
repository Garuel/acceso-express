import { TipoRespuestaEnum } from "../enum/tipo-alerta.enum";
import { ICustomError } from "../interfaces/custom-error.interface";

export class CustomError extends Error {
  constructor(public readonly data: ICustomError) {
    super(data.message);
    Object.setPrototypeOf(this, new.target.prototype);

    //  verificar si usa Node.js/V8
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, new.target);
    } else {
      this.stack = new Error(data.message).stack;
    }
  }

  toJSON(): ICustomError {
    return {
      ...this.data,
      fecha: this.data.fecha ?? new Date().toISOString(),
      tipoRespuesta: this.data.tipoRespuesta ?? TipoRespuestaEnum.Error,
      titulo: this.data.titulo ?? "Error",
    };
  }
}
