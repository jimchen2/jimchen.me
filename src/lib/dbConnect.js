// src/lib/dbConnect.js
// Shared `pg` connection pool.
//
// The pool is cached on globalThis so Next.js hot reloads in development do not
// leak a new pool per request.

import { Pool } from "pg";

const cached = (globalThis.__postgres ??= { pool: null, connecting: null });

async function dbConnect() {
  const connectionString = process.env.POSTGRESQL_URL;

  if (!connectionString) {
    throw new Error(
      "POSTGRESQL_URL is not configured. Set it in .env.local to use the Postgres backend.",
    );
  }

  if (cached.pool) return cached.pool;
  if (cached.connecting) return cached.connecting;

  cached.connecting = (async () => {
    const pool = new Pool({
      connectionString,
      // Neon closes idle connections; keep the pool small and let it retry.
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
      cached.pool = null;
    });

    try {
      const client = await pool.connect();
      try {
        await client.query("SELECT 1");
      } finally {
        client.release();
      }
    } catch (error) {
      await pool.end().catch(() => {});
      throw new Error(`Database connection failed: ${error.message}`);
    }

    cached.pool = pool;
    return pool;
  })();

  try {
    return await cached.connecting;
  } finally {
    cached.connecting = null;
  }
}

export default dbConnect;
