import logger from "./logger.js";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

pool.on("connect", () => {
  logger.success("Connect to the database");
});

export { pool as default };
