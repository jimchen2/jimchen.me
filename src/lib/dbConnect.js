import { Pool } from "pg";

const PG_URI = process.env.POSTGRESQL_URL;

// The pool is cached on `global` so hot reloads (and warm serverless
// invocations) reuse the same connections.
const cached = global.postgres || (global.postgres = { pool: null });

async function dbConnect() {
  if (!PG_URI) {
    throw new Error("POSTGRESQL_URL is not configured");
  }

  if (cached.pool) {
    return cached.pool;
  }

  const pool = new Pool({
    connectionString: PG_URI,
    max: Number(process.env.POSTGRESQL_POOL_MAX) || 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
    // Drop the cached pool so the next request can build a fresh one.
    cached.pool = null;
  });

  // Fail fast (and loudly) if the connection string is wrong.
  const client = await pool.connect();
  try {
    await client.query("SELECT NOW()");
    cached.pool = pool;
    return pool;
  } catch (error) {
    pool.end().catch(() => {});
    throw new Error(`Database connection failed: ${error.message}`);
  } finally {
    client.release();
  }
}

export default dbConnect;
