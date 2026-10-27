import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("weatherworld_token");

  if (token) {
    config.headers.set("Authorization", ["Bearer", token].join(" "));
  }

  return config;
});

export default api;
