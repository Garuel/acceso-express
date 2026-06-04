export interface ValidateTiempoGraciaInterface {
    esConcurrente: boolean;
    tokens?: {
        accessToken?: string;
        refreshToken?: string;
    };
}