"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_1 = __importDefault(require("./server"));
const datasource_config_1 = require("./shared/infrastructure/config/datasource.config");
const mongoose_config_1 = require("./shared/infrastructure/config/mongoose.config");
const logger_util_1 = require("./shared/infrastructure/utils/logger.util");
const PORT = process.env.PORT || 6687;
async function startServer() {
    try {
        await datasource_config_1.DataSourceConfig.initialize();
        logger_util_1.logger.info("Base de datos conectada con TypeORM");
        await (0, mongoose_config_1.initializeMongo)();
        server_1.default.listen(PORT, () => {
            logger_util_1.logger.info(`Servidor corriendo en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        logger_util_1.logger.error("Error fatal al iniciar el servidor:", error);
        process.exit(1);
    }
}
startServer();
