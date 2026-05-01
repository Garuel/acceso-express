import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "../../shared/domain/enum/custom-error.enum";
import { TipoRespuestaEnum } from "../../shared/domain/enum/tipo-alerta.enum";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const result = await this.authService.login({
        ...req.body,
        ip: ipAddress,
        userAgent: userAgent,
      });

      res.status(HttpStatusCode.OK).json({
        message: "Login exitoso",
        tipoRespuesta: TipoRespuestaEnum.Success,
        title: "Login",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.register(req.body);
      res.status(HttpStatusCode.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async preRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];
      const { username } = req.body;

      const plainKey = await this.authService.preRegister(
        username,
        ipAddress || "",
        userAgent || "",
      );

      return res.status(HttpStatusCode.OK).json({
        message: "Pre register exitoso",
        tipoRespuesta: TipoRespuestaEnum.Success,
        title: "Pre Register",
        data: plainKey,
      });
    } catch (error) {
      next(error);
    }
  }
}
