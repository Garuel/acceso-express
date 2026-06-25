import "reflect-metadata";
import serverless from "serverless-http";
import app from "./src/server";
import { logger } from "./src/shared/infrastructure/utils/logger.util";
import { DataSourceConfig } from "./src/shared/infrastructure/config/datasource.config";
import { initializeMongo } from "./src/shared/infrastructure/config/mongoose.config";

let isDbConnected = false;

async function bootstrap() {
    if (!isDbConnected) {
        try {
            await DataSourceConfig.initialize();
            logger.info("AWS Lambda: Base de datos Postgres conectada con TypeORM");

            await initializeMongo();
            logger.info("AWS Lambda: Base de datos MongoDB conectada con Mongoose");

            isDbConnected = true;
        } catch (error) {
            logger.error("AWS Lambda: Error fatal al conectar bases de datos:", error);
            throw error;
        }
    }
    return app;
}

export const handler = async (event: any, context: any) => {
    const initializedApp = await bootstrap();

    const serverlessHandler = serverless(initializedApp);
    return serverlessHandler(event, context);
};