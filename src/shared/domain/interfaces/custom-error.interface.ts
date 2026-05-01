import { HttpStatusCode } from "../enum/custom-error.enum";
import { TipoRespuestaEnum } from "../enum/tipo-alerta.enum";

export interface ICustomError {
  message: string;
  readonly statusCode: HttpStatusCode;
  readonly fecha?: string;
  readonly tipoRespuesta?: TipoRespuestaEnum;
  readonly titulo?: string;
}
