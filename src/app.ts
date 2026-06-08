import "reflect-metadata";

import app from "./server";
import { DataSourceConfig } from "./shared/infrastructure/config/datasource.config";
import { initializeMongo } from "./shared/infrastructure/config/mongoose.config";
import { logger } from "./shared/infrastructure/utils/logger.util";

const PORT = process.env.PORT || 6687;

async function startServer() {
  try {
    await DataSourceConfig.initialize();
    logger.info("Base de datos conectada con TypeORM");

    await initializeMongo();

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Error fatal al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
