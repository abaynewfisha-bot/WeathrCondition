const axios = require("axios");

const http = axios.create({
  timeout: 10000,
  headers: {
    Accept: "application/json"
  }
});

const knownCities = [
  { name: "Nairobi", country: "Kenya", latitude: -1.286389, longitude: 36.817223, timezone: "Africa/Nairobi" },
  { name: "Addis Ababa", country: "Ethiopia", latitude: 9.03, longitude: 38.74, timezone: "Africa/Addis_Ababa" },
  { name: "Riyadh", country: "Saudi Arabia", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh" },
  { name: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai" },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo" },
  { name: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276, timezone: "Europe/London" },
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York" },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris" },
  { name: "Oslo", country: "Norway", latitude: 59.9139, longitude: 10.7522, timezone: "Europe/Oslo" },
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney" }
];

function findNearestCity(latitude, longitude) {
  const radians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;

  return knownCities.reduce((nearest, city) => {
    const latitudeDelta = radians(city.latitude - latitude);
    const longitudeDelta = radians(city.longitude - longitude);
    const a =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(radians(latitude)) *
        Math.cos(radians(city.latitude)) *
        Math.sin(longitudeDelta / 2) ** 2;
    const distance = earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return !nearest || distance < nearest.distance
      ? { city, distance }
      : nearest;
  }, null).city;
}

async function searchCities(query) {
  const response = await http.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: {
        name: query,
        count: 10,
        language: "en",
        format: "json"
      }
    }
  );

  return (response.data.results || []).map((city) => ({
    name: city.name,
    country: city.country || "",
    admin1: city.admin1 || "",
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone || "auto"
  }));
}

async function getWeatherByCoordinates(city) {
  const response = await http.get(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude: city.latitude,
        longitude: city.longitude,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "is_day",
          "precipitation",
          "weather_code",
          "wind_speed_10m",
          "wind_direction_10m",
          "surface_pressure"
        ].join(","),
        hourly: [
          "temperature_2m",
          "precipitation_probability",
          "relative_humidity_2m",
          "wind_speed_10m",
          "uv_index"
        ].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_probability_max",
          "precipitation_sum",
          "wind_speed_10m_max",
          "sunrise",
          "sunset",
          "uv_index_max"
        ].join(","),
        forecast_days: 7,
        timezone: city.timezone || "auto"
      }
    }
  );

  return {
    location: city,
    current: response.data.current,
    hourly: response.data.hourly,
    daily: response.data.daily,
    units: {
      current: response.data.current_units,
      hourly: response.data.hourly_units,
      daily: response.data.daily_units
    },
    source: "Open-Meteo"
  };
}

async function getWeatherByCity(cityName) {
  const matches = await searchCities(cityName);

  if (!matches.length) {
    const error = new Error("City not found.");
    error.status = 404;
    throw error;
  }

  return getWeatherByCoordinates(matches[0]);
}

module.exports = {
  searchCities,
  getWeatherByCity,
  getWeatherByCoordinates,
  findNearestCity
};
