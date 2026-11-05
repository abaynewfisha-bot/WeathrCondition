import { useEffect, useState } from "react";
import { Heart, MapPin, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useWeather from "../controllers/useWeather";
import { getWeather } from "../services/weatherService";

import CurrentConditions from "../components/weather/CurrentConditions";
import WeatherCard from "../components/weather/WeatherCard";
import DailyForecast from "../components/weather/DailyForecast";
import HourlyForecast from "../components/weather/HourlyForecast";
import TemperatureChart from "../components/charts/TemperatureChart";
import PrecipitationChart from "../components/charts/PrecipitationChart";
import WorldMap from "../components/map/WorldMap";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import useFavorites from "../controllers/useFavorites";

const DEFAULT_CITIES = ["Tokyo", "London", "New York", "Paris"];

export default function DashboardView({ cityName = "Nairobi", onSelectCity }) {
  const navigate = useNavigate();
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
      {loading && <Loader message={`Loading weather for ${cityName}...`} />}

      {!loading && <ErrorMessage message={error} onRetry={refresh} />}
      <ErrorMessage message={favoriteError} />

      {weather && (
        <>
          <div className="relative">
            <CurrentConditions weather={weather} compact />
            <button
              className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0b1422]/50 text-white backdrop-blur transition hover:bg-[#0b1422]/80"
              onClick={refresh}
              disabled={loading}
              aria-label="Refresh weather"
              title="Refresh weather"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
            </button>
          </div>

          <section className="mt-[14px] grid grid-cols-2 gap-[10px] min-[681px]:grid-cols-4" aria-label="Other cities">
            {citiesLoading && (
              <div className="col-span-full rounded-[15px] bg-[#111d30] p-4 text-[#91a5bf]">Loading other cities...</div>
            )}

            {citiesError && (
              <div className="col-span-full rounded-[15px] bg-[#111d30] p-4 text-[#91a5bf]">{citiesError}</div>
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
                <div className="relative min-w-0" key={`${city}-${item.location.country}`}>
                  <WeatherCard
                    weather={item}
                    onSelect={() => selectCity(city)}
                    favorite={isFavorite}
                    compact
                  />

                  <button
                    className="absolute bottom-2 right-2 inline-flex min-h-[30px] items-center justify-center rounded-xl border-0 bg-transparent p-1.5"
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

          <div className="mt-[14px] grid grid-cols-1 items-stretch gap-[14px] min-[1051px]:grid-cols-2">
            <section className="min-w-0 rounded-[20px] bg-[#172438] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="mb-[18px] text-base font-semibold">World map</h2>
                <button className="mb-[18px] inline-flex min-h-[36px] items-center justify-center gap-2 rounded-lg border border-[#293a52] px-3 text-xs text-[#91a5bf] hover:border-[#ffa52f]" onClick={() => navigate("/map")}>
                  Open map
                </button>
              </div>

              <WorldMap onSelectCity={selectCity} compact />
            </section>

            <TemperatureChart weather={weather} compact />
          </div>

          <section className="mt-[14px] flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3 rounded-[15px] bg-[#172438] px-4 py-3" aria-label="Quick city search">
            {["Dubai", "Riyadh", "Yakutsk", "Oslo", "Addis Ababa"].map((city) => (
                <button
                  key={city}
                  className="flex items-center gap-2 border-0 bg-transparent p-0 text-sm font-medium text-[#e7edf7] hover:text-[#ffa52f]"
                  onClick={() => selectCity(city)}
                >
                  <MapPin size={16} color="#ffa52f" />
                  {city}
                </button>
              ))}
          </section>

          <section className="mt-6" aria-label="Detailed forecast">
            <h2 className="mb-3 text-lg font-semibold">Forecast details</h2>
            <div className="grid grid-cols-1 gap-4 min-[1051px]:grid-cols-2">
              <DailyForecast weather={weather} />
              <PrecipitationChart weather={weather} />
            </div>
            <HourlyForecast weather={weather} />
          </section>
        </>
      )}

      {!loading && !weather && !error && (
        <div className="min-w-0 rounded-[20px] bg-[#111d30] p-4 sm:p-5">
          <p>Weather data is not available yet.</p>
        </div>
      )}
    </>
  );
}
