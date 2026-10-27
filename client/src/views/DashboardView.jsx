import { useEffect, useState } from "react";
import { Heart, MapPin, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useWeather from "../controllers/useWeather";
import { getWeather } from "../services/weatherService";
import { useUnit } from "../context/UnitContext";

import CurrentConditions from "../components/weather/CurrentConditions";
import WeatherCard from "../components/weather/WeatherCard";
import DailyForecast from "../components/weather/DailyForecast";
import HourlyForecast from "../components/weather/HourlyForecast";
import TemperatureChart from "../components/charts/TemperatureChart";
import PrecipitationChart from "../components/charts/PrecipitationChart";
import WorldMap from "../components/map/WorldMap";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatTemperature } from "../utils/convertTemp";
import useFavorites from "../controllers/useFavorites";

const DEFAULT_CITIES = ["Tokyo", "London", "New York", "Paris"];

export default function DashboardView({ cityName = "Nairobi", onSelectCity }) {
  const navigate = useNavigate();
  const { unit } = useUnit();
  const { weather, loading, error, refresh } = useWeather(cityName);
  const {
    favorites: savedFavorites,
    add: addSavedFavorite,
    remove: removeSavedFavorite
  } = useFavorites();
  const token = localStorage.getItem("weatherworld_token");

  const [cityWeather, setCityWeather] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [favoriteAction, setFavoriteAction] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherworld_guest_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let active = true;

    async function loadCityCards() {
      setCitiesLoading(true);
      setCitiesError("");

      const results = await Promise.allSettled(
        DEFAULT_CITIES.map((city) => getWeather(city))
      );

      if (active) {
        const successful = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        setCityWeather(successful);

        if (successful.length === 0) {
          setCitiesError("Could not load the additional city weather cards.");
        }

        setCitiesLoading(false);
      }
    }

    loadCityCards();

    return () => {
      active = false;
    };
  }, []);

  async function toggleFavorite(city, country = "") {
    const cityKey = city.toLowerCase();

    if (token) {
      const savedFavorite = savedFavorites.find(
        (favorite) => favorite.city_name.toLowerCase() === cityKey
      );

      setFavoriteError("");
      setFavoriteAction(cityKey);
      try {
        if (savedFavorite) {
          await removeSavedFavorite(savedFavorite.id);
        } else {
          await addSavedFavorite(city, country);
        }
      } catch (err) {
        setFavoriteError(
          err.response?.data?.error || `Unable to update ${city} favorite.`
        );
      } finally {
        setFavoriteAction("");
      }
      return;
    }

    setFavorites((current) => {
      const next = current.includes(cityKey)
        ? current.filter((item) => item !== cityKey)
        : [...current, cityKey];

      localStorage.setItem(
        "weatherworld_guest_favorites",
        JSON.stringify(next)
      );

      return next;
    });
  }

  function selectCity(city) {
    onSelectCity?.(city);
  }

  return (
    <>
      <div className="card-row" style={{ marginBottom: 16 }}>
        <h1 className="page-heading" style={{ margin: 0 }}>Weather overview</h1>

        <button className="secondary-button" onClick={refresh}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading && <Loader message={`Loading weather for ${cityName}...`} />}

      {!loading && <ErrorMessage message={error} onRetry={refresh} />}
      <ErrorMessage message={favoriteError} />

      {weather && (
        <>
          <CurrentConditions weather={weather} />

          <section className="city-grid" aria-label="Other cities">
            {citiesLoading && (
              <div className="panel">Loading other cities...</div>
            )}

            {citiesError && (
              <div className="panel muted">{citiesError}</div>
            )}

            {cityWeather.map((item) => {
              const city = item.location.name;
              const isFavorite = token
                ? savedFavorites.some(
                    (favorite) =>
                      favorite.city_name.toLowerCase() === city.toLowerCase()
                  )
                : favorites.includes(city.toLowerCase());

              return (
                <div key={`${city}-${item.location.country}`} style={{ position: "relative" }}>
                  <WeatherCard
                    weather={item}
                    onSelect={() => selectCity(city)}
                    favorite={isFavorite}
                  />

                  <button
                    className="icon-button"
                    title={isFavorite ? "Remove favorite" : "Add favorite"}
                    aria-label={`Toggle ${city} favorite`}
                    onClick={() => toggleFavorite(city, item.location.country)}
                    disabled={favoriteAction === city.toLowerCase()}
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      border: 0,
                      minHeight: 30,
                      padding: 6
                    }}
                  >
                    <Heart
                      size={16}
                      fill={isFavorite ? "#ffa52f" : "none"}
                      color="#ffa52f"
                    />
                  </button>
                </div>
              );
            })}
          </section>

          <div className="dashboard-lower">
            <section className="panel map-panel">
              <div className="card-row">
                <h2 className="section-title">World map</h2>
                <button className="secondary-button" onClick={() => navigate("/map")}>
                  Open map
                </button>
              </div>

              <WorldMap onSelectCity={selectCity} />
            </section>

            <TemperatureChart weather={weather} />
          </div>

          <div className="dashboard-lower">
            <DailyForecast weather={weather} />
            <PrecipitationChart weather={weather} />
          </div>

          <HourlyForecast weather={weather} />

          <section className="panel section-spacing">
            <h2 className="section-title">Quick city search</h2>
            <p className="muted">
              Select a city to open its current conditions and forecasts.
            </p>

            <div className="city-ticker">
              {["Dubai", "Riyadh", "Yakutsk", "Oslo", "Addis Ababa"].map((city) => (
                <button
                  key={city}
                  className="ticker-item"
                  style={{ background: "transparent", border: 0 }}
                  onClick={() => selectCity(city)}
                >
                  <MapPin size={16} color="#ffa52f" />
                  {city}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {!loading && !weather && !error && (
        <div className="panel">
          <p>Weather data is not available yet.</p>
        </div>
      )}

      {weather && (
        <div className="muted section-spacing">
          Current temperature: {formatTemperature(weather.current?.temperature_2m, unit)}°
        </div>
      )}
    </>
  );
}
