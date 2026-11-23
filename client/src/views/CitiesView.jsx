import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Trash2 } from "lucide-react";

import CitySearchBar from "../components/search/CitySearchBar";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { getWeather } from "../services/weatherService";
import { useUnit } from "../context/UnitContext";
import { formatTemperature } from "../utils/convertTemp";
import { getWeatherDescription, getWeatherEmoji } from "../utils/weatherCodes";
import { useLanguage } from "../context/LanguageContext";
import useFavorites from "../controllers/useFavorites";

const STARTER_CITIES = ["Nairobi", "London", "Tokyo", "Dubai"];

export default function CitiesView() {
  const navigate = useNavigate();
  const { unit } = useUnit();
  const { t } = useLanguage();
  const { favorites: savedFavorites, add: addSavedFavorite, remove: removeSavedFavorite } = useFavorites();
  const token = localStorage.getItem("weatherworld_token");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [guestFavorites, setGuestFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherworld_guest_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let active = true;

    Promise.allSettled(STARTER_CITIES.map((city) => getWeather(city)))
      .then((results) => {
        if (!active) return;

        const loaded = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
        setCities(loaded);
        setError(loaded.length === 0
          ? "Could not load city weather. Check that the backend is running."
          : "");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addCity(cityName) {
    if (!cityName) return;
    setFavoriteError("");

    if (cities.some((item) =>
      item.location.name.toLowerCase() === cityName.toLowerCase()
    )) {
      navigate(`/city/${encodeURIComponent(cityName)}`);
      return;
    }

    try {
      setLoading(true);
      const weather = await getWeather(cityName);
      setCities((current) => [...current, weather]);
    } catch (err) {
      setFavoriteError(
        err.response?.data?.error || `Unable to load weather for ${cityName}.`
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(cityName, country) {
    setFavoriteError("");

    if (token) {
      const favorite = savedFavorites.find(
        (item) => item.city_name.toLowerCase() === cityName.toLowerCase()
      );

      try {
        if (favorite) {
          await removeSavedFavorite(favorite.id);
        } else {
          await addSavedFavorite(cityName, country);
        }
      } catch (err) {
        setFavoriteError(
          err.response?.data?.error || `Unable to update favorite ${cityName}.`
        );
      }
      return;
    }

    const key = cityName.toLowerCase();
    setGuestFavorites((current) => {
      const exists = current.some((item) => item.toLowerCase() === key);
      const next = exists
        ? current.filter((item) => item.toLowerCase() !== key)
        : [...current, cityName];
      localStorage.setItem(
        "weatherworld_guest_favorites",
        JSON.stringify(next)
      );
      return next;
    });
  }

  function removeCity(cityName) {
    setCities((current) =>
      current.filter((item) =>
        item.location.name.toLowerCase() !== cityName.toLowerCase()
      )
    );
  }

  return (
    <section className="min-w-0">
      <div className="mb-[18px]">
        <h1 className="text-2xl font-bold">{t("cities")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("searchLocations")}
        </p>
      </div>

      <CitySearchBar onSelect={(cityName) => addCity(cityName)} />
      <ErrorMessage message={error} />
      <ErrorMessage message={favoriteError} />

      {loading && <Loader message="Loading city weather..." />}

      {!loading && cities.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 min-[681px]:grid-cols-2 min-[1051px]:grid-cols-4">
          {cities.map((item) => {
            const cityName = item.location.name;
            const favorite = token
              ? savedFavorites.some(
                  (item) => item.city_name.toLowerCase() === cityName.toLowerCase()
                )
              : guestFavorites.some(
                  (item) => item.toLowerCase() === cityName.toLowerCase()
                );

            return (
              <article
                key={`${cityName}-${item.location.country}`}
                className="rounded-[18px] border border-[var(--border)] bg-[var(--panel)] p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 font-bold">
                      <MapPin size={17} className="text-[#75a8ee]" />
                      {cityName}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {item.location.country}
                    </p>
                  </div>
                  <button
                    type="button"
                    title={favorite ? "Remove favorite" : "Add favorite"}
                    aria-label={`Toggle ${cityName} favorite`}
                    onClick={() => void toggleFavorite(cityName, item.location.country)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]"
                  >
                    <Heart
                      size={17}
                      fill={favorite ? "#ef8dad" : "none"}
                      className="text-[#ef8dad]"
                    />
                  </button>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full text-left"
                  onClick={() => navigate(`/city/${encodeURIComponent(cityName)}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[38px] font-extrabold leading-none">
                      {formatTemperature(item.current.temperature_2m, unit)}
                      {unit}
                    </div>
                    <span className="text-[32px]">
                      {getWeatherEmoji(item.current.weather_code)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {getWeatherDescription(item.current.weather_code)}
                  </p>
                </button>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
                  <span>Humidity {item.current.relative_humidity_2m}%</span>
                  <button
                    type="button"
                    title={`Remove ${cityName}`}
                    onClick={() => removeCity(cityName)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {cities.length > 0 && (
        <section className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
          <h2 className="mb-4 text-lg font-bold">{t("compare")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="px-3 py-3">City</th>
                  <th className="px-3 py-3">Condition</th>
                  <th className="px-3 py-3">Temperature</th>
                  <th className="px-3 py-3">Feels like</th>
                  <th className="px-3 py-3">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((item) => (
                  <tr
                    key={`row-${item.location.name}`}
                    className="cursor-pointer border-b border-[var(--border)] last:border-0 hover:bg-[var(--card)]"
                    onClick={() =>
                      navigate(`/city/${encodeURIComponent(item.location.name)}`)
                    }
                  >
                    <td className="px-3 py-3 font-bold">{item.location.name}</td>
                    <td className="px-3 py-3">
                      {getWeatherDescription(item.current.weather_code)}
                    </td>
                    <td className="px-3 py-3 font-bold">
                      {formatTemperature(item.current.temperature_2m, unit)}{unit}
                    </td>
                    <td className="px-3 py-3">
                      {formatTemperature(item.current.apparent_temperature, unit)}{unit}
                    </td>
                    <td className="px-3 py-3">
                      {item.current.relative_humidity_2m}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}
