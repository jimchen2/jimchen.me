// dbConnect.js
const { Pool } = require('pg');

const PG_URI = process.env.POSTGRESQL_URL;

let cached = global.postgres;

if (!cached) {
  cached = global.postgres = { pool: null };
}

async function dbConnect() {
  if (cached.pool) {
    return cached.pool;
  }

  const pool = new Pool({
    connectionString: PG_URI,
    max: 20, // Maximum number of connections in pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Timeout after 2 seconds if connection can't be established
  });

  // Test the connection
  await pool.query('SELECT NOW()');
  console.log('Connected to PostgreSQL');

  cached.pool = pool;
  return pool;
}

module.exports = dbConnect;