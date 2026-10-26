const axios = require("axios");

const http = axios.create({
  timeout: 15000,
  headers: {
    Accept: "application/json"
  }
});

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
  getWeatherByCoordinates
};
