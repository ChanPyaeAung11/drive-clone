import { drizzle } from "drizzle-orm/singlestore";

import { env } from "~/env";
import * as schema from "./schema";
import { createPool, type Pool } from "mysql2/promise";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    port: parseInt(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {}, // due 2 how mysql lib is, this is needed
    maxIdle: 0, // no prob reconnecting after idle time
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err) => {
  console.error("Database connection error: ", err);
});

export const db = drizzle(conn, { schema });
