import { singleton } from "tsyringe";
import { JwtService } from "../../../jwt/jwt.service";
import { RefreshInfoToken, UsuarioInfoToken } from "../../dto/login.dto";
import { TokensInterface } from "../../interface/token.interface";

@singleton()
export class TokenManagerService {
    constructor(
        private readonly accessJwtService: JwtService,
        private readonly refreshJwtService: JwtService,
    ) { }

    public generateTokens(
        usuarioInfo: UsuarioInfoToken,
        refreshInfo: RefreshInfoToken,
    ): TokensInterface {
        const accessToken = this.accessJwtService.sign(usuarioInfo);
        const refreshToken = this.refreshJwtService.sign(refreshInfo);

        return {
            accessToken,
            refreshToken,
        };
    }
}