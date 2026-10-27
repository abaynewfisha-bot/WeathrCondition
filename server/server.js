require("dotenv").config();

const app = require("./src/app");
const { pool } = require("./src/config/db");
const { port } = require("./src/config/env");

async function startServer() {
  try {
    // Fail early if the database is not available.
    await pool.query("SELECT 1");

    const server = app.listen(port, () => {
      console.log(`WeatherWorld API running at http://localhost:${port}`);
      console.log(`Health check: http://localhost:${port}/api/health`);
    });

    async function shutdown() {
      console.log("Shutting down WeatherWorld API...");

      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Could not start the API:", error.message);
    process.exit(1);
  }
}

startServer();
