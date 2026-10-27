import { useCallback, useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";

export default function useWeather(cityName = "Nairobi") {
  const [weather, setWeather] = useState(null);
  const [weatherCity, setWeatherCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!cityName) return;

    setLoading(true);
    setError("");

    try {
      const data = await getWeather(cityName);
      setWeather(data);
      setWeatherCity(cityName);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Unable to load weather. Check that the backend is running."
      );
      setWeatherCity(cityName);
    } finally {
      setLoading(false);
    }
  }, [cityName]);

  useEffect(() => {
    let active = true;

    const loadWeather = async () => {
      try {
        const data = await getWeather(cityName);
        if (!active) return;

        setWeather(data);
        setWeatherCity(cityName);
        setError("");
      } catch (err) {
        if (!active) return;

        setWeatherCity(cityName);
        setError(
          err.response?.data?.error ||
          "Unable to load weather. Check that the backend is running."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    if (cityName) {
      void loadWeather();
    }

    return () => {
      active = false;
    };
  }, [cityName]);

  const isCurrentCityLoaded = weatherCity === cityName;

  return {
    weather: isCurrentCityLoaded ? weather : null,
    loading: Boolean(cityName) && (loading || !isCurrentCityLoaded),
    error: isCurrentCityLoaded ? error : "",
    refresh
  };
}
