import mongoose from "mongoose";
import { logger } from "../utils/logger.util";
import dotenv from "dotenv";

dotenv.config();

export async function initializeMongo(): Promise<void> {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("La variable MONGO_URI no está definida en el entorno");
        }

        await mongoose.connect(mongoUri);
        logger.info("Base de datos MongoDB (Auditoría) conectada con éxito");
    } catch (error) {
        logger.error("Error al conectar MongoDB:", error);
        throw error;
    }
}