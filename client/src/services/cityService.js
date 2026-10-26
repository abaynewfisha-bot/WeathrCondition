// cityService: API calls to the backend
import api from "./api";

export async function getCities() {
  const response = await api.get("/cities");
  return response.data.cities || [];
}

export async function searchCities(query) {
  const response = await api.get("/cities/search", {
    params: { q: query }
  });

  return response.data.results || [];
}
