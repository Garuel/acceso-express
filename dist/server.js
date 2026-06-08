"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./shared/middlewares/error.middleware");
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const profile_route_1 = __importDefault(require("./modules/profile/profile.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares de configuración global
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(`${process.env.CONTEXT}/auth`, auth_route_1.default);
app.use(`${process.env.CONTEXT}/profile`, profile_route_1.default);
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
