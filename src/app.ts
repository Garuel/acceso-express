import "reflect-metadata";
import dotenv from "dotenv";

import app from "./server";
import { logger } from "./shared/infrastructure/utils/logger.util";
import { DataSourceConfig } from "./shared/infrastructure/config/datasource.config";

const PORT = process.env.PORT || 6687;

async function startServer() {
  try {
    await DataSourceConfig.initialize();
    logger.info("Base de datos conectada con TypeORM");

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Error fatal al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
