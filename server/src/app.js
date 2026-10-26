const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");
const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const { pool } = require("./config/db");

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const allowedOrigins = env.clientUrl
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      // Permit tools such as curl that do not send an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS."));
    }
  })
);

app.use(express.json({ limit: "30kb" }));
app.use(morgan("dev"));
app.use("/api", limiter);

app.get("/api/health", async (req, res) => {
  let database = "not configured";

  if (env.databaseUrl) {
    try {
      await pool.query("SELECT 1");
      database = "connected";
    } catch {
      database = "disconnected";
    }
  }

  const healthy = database !== "disconnected";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "WeatherWorld API",
    database
  });
});

app.use("/api", require("./routes"));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use(errorHandler);
if (env.nodeEnv !== "test") {
  require("./jobs/refreshWeatherJob").startWeatherRefreshJob();
}

module.exports = app;
