import dotenv from "dotenv";

dotenv.config();

const db_config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 8889,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "raven_bank",
  },
  migrations: {
    directory: "./src/database/migrations",
    tableName: "knex_migrations",
    extension: "ts",
  },
} as const;

export { db_config };
