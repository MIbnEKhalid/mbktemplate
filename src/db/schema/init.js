import path from "node:path";
import { fileURLToPath } from "node:url";
import { applySchema } from "mbkauthe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initializes PostgreSQL schema for the application.
 * @param {import("pg").Pool} pool
 */
export async function initPostgresSchema(pool) {
  if (!pool) return;
  const schemaPath = path.join(__dirname, "postgres.sql");
  await applySchema(pool, schemaPath, { name: "template-postgres" });
  console.log("[MBKTemplate] PostgreSQL schema initialized successfully.");
}

/**
 * Initializes SQLite schema for the application.
 * @param {object} db - Sqlite adapter or instance
 */
export async function initSqliteSchema(db) {
  if (!db) return;
  const schemaPath = path.join(__dirname, "sqlite.sql");
  await applySchema(db, schemaPath, { name: "template-sqlite" });
  console.log("[MBKTemplate] SQLite schema initialized successfully.");
}

export default { initPostgresSchema, initSqliteSchema };
