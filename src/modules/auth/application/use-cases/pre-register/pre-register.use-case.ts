import { randomBytes } from "crypto";
import { singleton } from "tsyringe";
import { DataSource } from "typeorm";
import { v4 } from "uuid";
import { LoginRepository } from "../../../../../shared/database/repositories/auth/login/login.repository";

@singleton()
export class PreRegisterUseCase {
    constructor(
        private readonly dataSource: DataSource
    ) { }

    async execute(username: string,
        ip: string,
        userAgent: string): Promise<string> {
        const loginRepository = new LoginRepository(this.dataSource);

        //  llave aleatoria de 32 caracteres (16 IV + 16 Key)
        const plainKey = randomBytes(16).toString("hex");

        await loginRepository.eliminarPorUsername(username);

        await loginRepository.crear({
            username,
            confirmPassword: plainKey,
            fechaExpiracion: new Date(Date.now() + 300000),
            sessionToken: v4(),
            ipAddress: ip,
            userAgent: userAgent,
        });

        return plainKey;
    }
}