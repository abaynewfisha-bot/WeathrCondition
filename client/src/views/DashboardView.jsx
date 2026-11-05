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
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="m-0 text-2xl font-bold">Weather overview</h1>

        <button className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)]" onClick={refresh}>
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

          <section className="mt-[18px] grid grid-cols-1 gap-[14px] min-[681px]:grid-cols-2 min-[1051px]:grid-cols-4" aria-label="Other cities">
            {citiesLoading && (
              <div className="rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">Loading other cities...</div>
            )}

            {citiesError && (
              <div className="rounded-[20px] bg-[var(--panel)] p-4 text-[var(--muted)] sm:p-5">{citiesError}</div>
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
                <div className="relative" key={`${city}-${item.location.country}`}>
                  <WeatherCard
                    weather={item}
                    onSelect={() => selectCity(city)}
                    favorite={isFavorite}
                  />

                  <button
                    className="absolute right-[10px] bottom-[10px] inline-flex min-h-[30px] items-center justify-center rounded-xl border-0 bg-transparent p-1.5 text-[var(--text)] hover:border-[var(--accent)]"
                    title={isFavorite ? "Remove favorite" : "Add favorite"}
                    aria-label={`Toggle ${city} favorite`}
                    onClick={() => toggleFavorite(city, item.location.country)}
                    disabled={favoriteAction === city.toLowerCase()}
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

          <div className="mt-[18px] grid grid-cols-1 gap-4 min-[1051px]:grid-cols-2">
            <section className="min-h-[310px] min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="mb-[18px] text-lg font-semibold">World map</h2>
                <button className="mb-[18px] inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)]" onClick={() => navigate("/map")}>
                  Open map
                </button>
              </div>

              <WorldMap onSelectCity={selectCity} />
            </section>

            <TemperatureChart weather={weather} />
          </div>

          <div className="mt-[18px] grid grid-cols-1 gap-4 min-[1051px]:grid-cols-2">
            <DailyForecast weather={weather} />
            <PrecipitationChart weather={weather} />
          </div>

          <HourlyForecast weather={weather} />

          <section className="mt-5 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
            <h2 className="mb-[18px] text-lg font-semibold">Quick city search</h2>
            <p className="text-[var(--muted)]">
              Select a city to open its current conditions and forecasts.
            </p>

            <div className="mt-[18px] flex flex-wrap gap-7">
              {["Dubai", "Riyadh", "Yakutsk", "Oslo", "Addis Ababa"].map((city) => (
                <button
                  key={city}
                  className="flex items-center gap-2 border-0 bg-transparent text-[var(--text)]"
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
        <div className="min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
          <p>Weather data is not available yet.</p>
        </div>
      )}

      {weather && (
        <div className="mt-5 text-[var(--muted)]">
          Current temperature: {formatTemperature(weather.current?.temperature_2m, unit)}°
        </div>
      )}
    </>
  );
}
