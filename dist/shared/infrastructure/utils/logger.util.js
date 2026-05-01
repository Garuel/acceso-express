"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    level: "verbose",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp, stack }) => {
                return `[${timestamp}] ${level}: ${stack || message}`;
            })),
        }),
        new winston_1.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston_1.transports.File({
            filename: "logs/combined.log",
        }),
    ],
});
