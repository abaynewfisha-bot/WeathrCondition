const cron = require("node-cron");
const City = require("../models/City");
const WeatherReading = require("../models/WeatherReading");
const provider = require("../services/openWeatherService");
const logger = require("../utils/logger");

function startWeatherRefreshJob() {
  // Run every 30 minutes.
  cron.schedule("*/30 * * * *", async () => {
    logger.info("Scheduled weather refresh started");

    try {
      const cities = await City.list();

      for (const city of cities) {
        try {
          const weather = await provider.getWeatherByCoordinates(city);

          await WeatherReading.save(city.id, weather);

          logger.info(`Weather refreshed: ${city.name}`);
        } catch (error) {
          logger.error(
            `Weather refresh failed for ${city.name}`,
            error.message
          );
        }
      }
    } catch (error) {
      logger.error("Weather refresh job failed", error.message);
    }
  });

  logger.info("Weather refresh job scheduled");
}

module.exports = { startWeatherRefreshJob };
