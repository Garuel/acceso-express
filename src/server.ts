// src/server.ts
import express, { Application } from "express";
import cors from "cors";
import { globalErrorHandler } from "./shared/middlewares/error.middleware";
import authRouter from "./modules/auth/auth.route";
import profileRouter from "./modules/profile/profile.route";
import auditoriaRouter from "./modules/auditorias/audit.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

// Middlewares de configuración global
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use(`${process.env.CONTEXT}/auth`, authRouter);
app.use(`${process.env.CONTEXT}/profile`, profileRouter);
app.use(`${process.env.CONTEXT}/auditoria`, auditoriaRouter);

app.use(globalErrorHandler);

export default app;
