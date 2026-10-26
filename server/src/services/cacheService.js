const City = require("../models/City");
const WeatherReading = require("../models/WeatherReading");
const provider = require("./openWeatherService");

const CACHE_TTL_MS = 10 * 60 * 1000;

async function getWeather(cityName) {
  const matches = await provider.searchCities(cityName);

  if (!matches.length) {
    const error = new Error("City not found.");
    error.status = 404;
    throw error;
  }

  const match = matches[0];
  const city = await City.upsert(match);
  const cached = await WeatherReading.latest(city.id);

  if (
    cached &&
    Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS
  ) {
    const payload =
      typeof cached.payload === "string"
        ? JSON.parse(cached.payload)
        : cached.payload;

    return payload;
  }

  const weather = await provider.getWeatherByCoordinates(match);

  await WeatherReading.save(city.id, weather);

  return weather;
}

module.exports = { getWeather };
