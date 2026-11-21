// weatherService: API calls to the backend
import api from "./api";

export async function getWeather(city = "Nairobi") {
  const response = await api.get("/weather", {
    params: { city }
  });

  return response.data;
}

export async function searchWeatherCities(query) {
  const response = await api.get("/weather/search", {
    params: { q: query }
  });

  return response.data.results || [];
}

export async function getWeatherByCoordinates(latitude, longitude) {
  const response = await api.get("/weather/coordinates", {
    params: { latitude, longitude }
  });

  return response.data;
}
