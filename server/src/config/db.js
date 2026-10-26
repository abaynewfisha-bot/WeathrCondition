const { Pool } = require("pg");
const { databaseUrl, nodeEnv } = require("./env");

const pool = new Pool({
  connectionString: databaseUrl || undefined,
  ssl:
    nodeEnv === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  connectionTimeoutMillis: 5000
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error.message);
});

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params)
};
