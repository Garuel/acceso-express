import { singleton } from "tsyringe";
import Redis from "ioredis";
import { logger } from "../utils/logger.util";
import dotenv from "dotenv";

dotenv.config();

@singleton()
export class RedisService {
    private readonly redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
            maxRetriesPerRequest: 3,
        });

        this.redisClient.on("connect", () => {
            logger.info("Cache de Redis conectada con éxito");
        });

        this.redisClient.on("error", (error) => {
            logger.error("Error en la conexión de Redis:", error);
        });
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        await this.redisClient.set(key, value, "EX", ttlSeconds);
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}