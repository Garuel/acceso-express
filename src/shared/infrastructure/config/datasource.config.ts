import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export const DataSourceConfig = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + "/../../../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../../../migrations/*{.ts,.js}"],
  migrationsRun: true,
});
