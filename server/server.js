require("dotenv").config();

const app = require("./src/app");
const { port } = require("./src/config/env");

const server = app.listen(port, () => {
  console.log(`WeatherWorld API running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("WeatherWorld server stopped.");
    process.exit(0);
  });
});
