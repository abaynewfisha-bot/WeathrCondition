// favoriteService: API calls to the backend
import api from "./api";

export async function getFavorites() {
  const response = await api.get("/favorites");
  return response.data.favorites || [];
}

export async function addFavorite(cityName, country = "") {
  const response = await api.post("/favorites", {
    cityName,
    country
  });

  return response.data.favorite;
}

export async function removeFavorite(id) {
  const response = await api.delete(`/favorites/${id}`);
  return response.data;
}

export async function registerUser(name, email, password) {
  const response = await api.post("/auth/register", {
    name,
    email,
    password
  });

  if (response.data.token) {
    localStorage.setItem("weatherworld_token", response.data.token);
  }

  return response.data;
}

export async function loginUser(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password
  });

  if (response.data.token) {
    localStorage.setItem("weatherworld_token", response.data.token);
  }

  return response.data;
}
