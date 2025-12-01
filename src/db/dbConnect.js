// dbConnect.js
const { Pool } = require("pg");

const PG_URI = process.env.POSTGRESQL_URL;

// Initialize cached connection object once
let cached = global.postgres || (global.postgres = { pool: null });

async function dbConnect() {
  // Return existing pool if available
  if (cached.pool) {
    return cached.pool;
  }

  // Create a new pool with better error handling
  const pool = new Pool({
    connectionString: PG_URI,
  });

  // Add error handler to pool
  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
    // On critical error, clear the cached pool so a new one can be created
    cached.pool = null;
  });

  try {
    // Test the connection
    const client = await pool.connect();
    try {
      await client.query("SELECT NOW()");
      console.log("Connected to PostgreSQL successfully");
      cached.pool = pool;
      return pool;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    // Better error handling
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

module.exports = dbConnect;
