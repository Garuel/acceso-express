import { PreRegisterUseCase } from "./pre-register.use-case";
import { randomBytes } from "crypto";
import { v4 } from "uuid";

jest.mock("crypto", () => ({
    randomBytes: jest.fn(),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(),
}));

const mockLoginRepository = {
    setTransactionManager: jest.fn().mockReturnThis(),
    eliminarPorUsername: jest.fn(),
    crear: jest.fn(),
};

let preRegisterUseCase: PreRegisterUseCase;
const mockEntityManager = {};
const mockDataSource = {
    transaction: jest.fn()
};

beforeEach(() => {
    jest.clearAllMocks();

    mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
    });

    preRegisterUseCase = new PreRegisterUseCase(
        mockDataSource as any,
        mockLoginRepository as any
    );
});

describe("execute()", () => {
    it("debería eliminar el registro previo, crear uno nuevo con expiración de 5 min y retornar la llave", async () => {

        const mockPlainKeyBytes = "1234567890abcdef";
        (randomBytes as jest.Mock).mockReturnValue(Buffer.from(mockPlainKeyBytes, "hex"));

        const mockUuid = "mocked-uuid-v4-1234";
        (v4 as jest.Mock).mockReturnValue(mockUuid);


        mockDataSource.transaction.mockImplementation(async (callback) => await callback(mockEntityManager));



        const baseTime = new Date("2026-06-10T00:00:00.000Z");
        jest.useFakeTimers().setSystemTime(baseTime);


        mockLoginRepository.eliminarPorUsername.mockResolvedValue(undefined);
        mockLoginRepository.crear.mockResolvedValue(undefined);

        const username = "sebastiandomenack";
        const ip = "::1";
        const userAgent = "bruno-runtime/3.3.0";

        const resultado = await preRegisterUseCase.execute(username, ip, userAgent);

        const expectedKey = Buffer.from(mockPlainKeyBytes, "hex").toString("hex");
        expect(resultado).toBe(expectedKey);

        expect(mockLoginRepository.eliminarPorUsername).toHaveBeenCalledWith(username);
        expect(mockLoginRepository.eliminarPorUsername).toHaveBeenCalledTimes(1);

        expect(mockLoginRepository.crear).toHaveBeenCalledWith({
            username: username,
            confirmPassword: expectedKey,
            fechaExpiracion: new Date(baseTime.getTime() + 300000),
            sessionToken: mockUuid,
            ipAddress: ip,
            userAgent: userAgent,
        });
        expect(mockLoginRepository.crear).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });
})