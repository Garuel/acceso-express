// src/server.ts
import express, { Application } from "express";
import cors from "cors";
import { globalErrorHandler } from "./shared/middlewares/error.middleware";
import authRouter from "./modules/auth/auth.route";
import profileRouter from "./modules/profile/profile.route";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middlewares de configuración global
app.use(cors());
app.use(express.json());

app.use(`${process.env.CONTEXT}/auth`, authRouter);
app.use(`${process.env.CONTEXT}/profile`, profileRouter);

app.use(globalErrorHandler);

export default app;
