import { TipoRespuestaEnum } from "../enum/tipo-alerta.enum";

export interface ResponseAPI<T = {}> {
  tipoRespuesta?: TipoRespuestaEnum;
  title?: string;
  message: string;
  data?: T;
}
