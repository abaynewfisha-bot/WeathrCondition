import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Plus, Trash2 } from "lucide-react";

import useFavorites from "../controllers/useFavorites";
import { getWeather } from "../services/weatherService";
import { useUnit } from "../context/UnitContext";
import { formatTemperature } from "../utils/convertTemp";
import { getWeatherDescription, getWeatherEmoji } from "../utils/weatherCodes";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { useLanguage } from "../context/LanguageContext";

export default function FavoritesView() {
  const navigate = useNavigate();
  const { unit } = useUnit();
  const { t } = useLanguage();
  const { favorites, loading, error, refresh, remove } = useFavorites();
  const token = localStorage.getItem("weatherworld_token");

  const [guestFavorites, setGuestFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("weatherworld_guest_favorites") || "[]"
      );
    } catch {
      return [];
    }
  });
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const savedNames = token
    ? favorites.map((favorite) => favorite.city_name)
    : guestFavorites;

  useEffect(() => {
    if (savedNames.length === 0) {
      setWeatherData([]);
      setWeatherLoading(false);
      return undefined;
    }

    let active = true;
    setWeatherLoading(true);
    setWeatherError("");

    Promise.allSettled(
      savedNames.map((cityName) => getWeather(cityName))
    ).then((results) => {
      if (!active) return;

      const next = results.map((result, index) => ({
        cityName: savedNames[index],
        weather: result.status === "fulfilled" ? result.value : null,
        error: result.status === "rejected"
          ? result.reason?.response?.data?.error ||
            `Unable to load weather for ${savedNames[index]}`
          : ""
      }));
      setWeatherData(next);
      if (next.some((item) => item.error)) {
        setWeatherError("Some favorite locations could not be loaded.");
      }
      setWeatherLoading(false);
    });

    return () => {
      active = false;
    };
  }, [token, favorites, guestFavorites]);

  function addGuestFavorite(event) {
    event.preventDefault();
    const cityName = cityInput.trim();
    if (!cityName) return;

    const alreadySaved = guestFavorites.some(
      (item) => item.toLowerCase() === cityName.toLowerCase()
    );
    if (alreadySaved) {
      setWeatherError(`${cityName} is already in your favorites.`);
      return;
    }

    const next = [...guestFavorites, cityName];
    localStorage.setItem("weatherworld_guest_favorites", JSON.stringify(next));
    setGuestFavorites(next);
    setCityInput("");
    setWeatherError("");
  }

  function removeGuestFavorite(cityName) {
    const next = guestFavorites.filter(
      (item) => item.toLowerCase() !== cityName.toLowerCase()
    );
    localStorage.setItem("weatherworld_guest_favorites", JSON.stringify(next));
    setGuestFavorites(next);
  }

  async function removeSavedFavorite(cityName) {
    const favorite = favorites.find(
      (item) => item.city_name.toLowerCase() === cityName.toLowerCase()
    );
    if (favorite) await remove(favorite.id);
  }

  function removeFavorite(cityName) {
    if (token) {
      void removeSavedFavorite(cityName);
    } else {
      removeGuestFavorite(cityName);
    }
  }

  return (
    <section className="min-w-0">
      <div className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("favorites")}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Saved cities with quick access to current weather.
          </p>
        </div>
        <div className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm">
          <strong>{savedNames.length}</strong>{" "}
          <span className="text-[var(--muted)]">saved locations</span>
        </div>
      </div>

      {loading && token && <Loader message="Loading saved favorites..." />}
      <ErrorMessage message={error} onRetry={refresh} />
      <ErrorMessage message={weatherError} />

      {!token && (
        <form
          className="mb-4 flex flex-wrap gap-3"
          onSubmit={addGuestFavorite}
        >
          <label className="min-w-[220px] flex-1">
            <span className="sr-only">City name</span>
            <input
              value={cityInput}
              onChange={(event) => setCityInput(event.target.value)}
              placeholder="Add a city to favorites"
              className="min-h-[48px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--panel)] px-4 text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[#75a5e7]"
            />
          </label>
          <button
            type="submit"
            disabled={!cityInput.trim()}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-[14px] border-0 bg-[linear-gradient(135deg,#4e82df,#806cbf)] px-5 font-bold text-white disabled:opacity-50"
          >
            <Plus size={18} />
            Add location
          </button>
        </form>
      )}

      {weatherLoading && <Loader message="Loading favorite weather..." />}

      {!weatherLoading && weatherData.length === 0 && (
        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--panel)] px-6 py-12 text-center">
          <Heart size={38} className="mx-auto text-[#ef8dad]" />
          <h2 className="mt-4 text-lg font-bold">{t("noFavorites")}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Add a city from the Cities page or search page.
          </p>
          <button
            type="button"
            className="mt-5 min-h-[44px] rounded-[12px] bg-[linear-gradient(135deg,#ec9a45,#d46f91)] px-5 font-bold text-white"
            onClick={() => navigate("/cities")}
          >
            Browse cities
          </button>
        </div>
      )}

      {weatherData.length > 0 && (
        <div className="grid grid-cols-1 gap-4 min-[681px]:grid-cols-2 min-[1051px]:grid-cols-4">
          {weatherData.map(({ cityName, weather, error: itemError }) => (
            <article
              key={cityName}
              className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--panel)]"
            >
              {weather ? (
                <button
                  type="button"
                  className="w-full p-5 text-left"
                  onClick={() =>
                    navigate(`/city/${encodeURIComponent(cityName)}`)
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{cityName}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {weather.location.country}
                      </p>
                    </div>
                    <Heart
                      size={20}
                      fill="#ef8dad"
                      className="text-[#ef8dad]"
                    />
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div className="text-[42px] font-extrabold leading-none">
                      {formatTemperature(weather.current.temperature_2m, unit)}
                      {unit}
                    </div>
                    <span className="text-[38px]">
                      {getWeatherEmoji(weather.current.weather_code)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    {getWeatherDescription(weather.current.weather_code)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Humidity {weather.current.relative_humidity_2m}% ·{" "}
                    Wind {Math.round(weather.current.wind_speed_10m)} km/h
                  </p>
                </button>
              ) : (
                <div className="p-5">
                  <p className="font-bold">{cityName}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {itemError || "Weather unavailable"}
                  </p>
                </div>
              )}

              <div className="border-t border-[var(--border)] p-3">
                <button
                  type="button"
                  onClick={() => removeFavorite(cityName)}
                  className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] text-sm font-semibold text-[var(--muted)]"
                >
                  <Trash2 size={15} />
                  Remove favorite
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
