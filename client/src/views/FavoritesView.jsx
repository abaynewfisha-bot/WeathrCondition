import { useEffect, useState } from "react";
import { Heart, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useFavorites from "../controllers/useFavorites";
import { getWeather } from "../services/weatherService";
import WeatherCard from "../components/weather/WeatherCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

export default function FavoritesView() {
  const navigate = useNavigate();
  const { favorites, loading, error, refresh, remove } = useFavorites();

  const [guestFavorites, setGuestFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("weatherworld_guest_favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [guestWeather, setGuestWeather] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestWeatherError, setGuestWeatherError] = useState("");
  const [favoriteWeather, setFavoriteWeather] = useState({});
  const [guestCityInput, setGuestCityInput] = useState("");

  const token = localStorage.getItem("weatherworld_token");

  useEffect(() => {
    if (token || guestFavorites.length === 0) return undefined;

    let active = true;

    Promise.allSettled(guestFavorites.map((city) => getWeather(city)))
      .then((results) => {
        if (!active) return;

        setGuestWeather(
          results.map((result, index) => ({
            city: guestFavorites[index],
            weather: result.status === "fulfilled" ? result.value : null,
            error: result.status === "rejected"
              ? result.reason?.response?.data?.error ||
                `Unable to load weather for ${guestFavorites[index]}.`
              : ""
          }))
        );
        if (results.some((result) => result.status === "rejected")) {
          setGuestWeatherError("Some guest favorites could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setGuestLoading(false);
      });

    return () => {
      active = false;
    };
  }, [guestFavorites, token]);

  useEffect(() => {
    if (!token || favorites.length === 0) return undefined;

    let active = true;

    Promise.allSettled(
      favorites.map(async (favorite) => ({
        id: favorite.id,
        cityName: favorite.city_name,
        weather: await getWeather(favorite.city_name)
      }))
    ).then((results) => {
      if (!active) return;

      const nextWeather = {};
      results.forEach((result, index) => {
        const favorite = favorites[index];
        nextWeather[favorite.id] = result.status === "fulfilled"
          ? { cityName: favorite.city_name, weather: result.value.weather }
          : {
              cityName: favorite.city_name,
              error: result.reason?.response?.data?.error ||
                `Unable to load weather for ${favorite.city_name}.`
            };
      });
      setFavoriteWeather(nextWeather);
    });

    return () => {
      active = false;
    };
  }, [favorites, token]);

  async function loadGuestWeather() {
    setGuestLoading(true);
    setGuestWeatherError("");

    try {
      const results = await Promise.allSettled(
        guestFavorites.map((city) => getWeather(city))
      );

      setGuestWeather(
        results.map((result, index) => ({
          city: guestFavorites[index],
          weather: result.status === "fulfilled" ? result.value : null,
          error: result.status === "rejected"
            ? result.reason?.response?.data?.error ||
              `Unable to load weather for ${guestFavorites[index]}.`
            : ""
        }))
      );

      if (results.some((result) => result.status === "rejected")) {
        setGuestWeatherError("Some guest favorites could not be loaded.");
      }
    } finally {
      setGuestLoading(false);
    }
  }

  function addGuestFavorite(event) {
    event.preventDefault();
    const city = guestCityInput.trim();
    if (!city) return;

    const alreadySaved = guestFavorites.some(
      (favorite) => favorite.toLowerCase() === city.toLowerCase()
    );
    if (alreadySaved) {
      setGuestWeatherError(`${city} is already in your favorites.`);
      return;
    }

    const nextFavorites = [...guestFavorites, city];
    localStorage.setItem(
      "weatherworld_guest_favorites",
      JSON.stringify(nextFavorites)
    );
    setGuestFavorites(nextFavorites);
    setGuestWeather(null);
    setGuestWeatherError("");
    setGuestCityInput("");
  }

  return (
    <>
      <h1 className="mb-[18px] text-2xl font-bold">Your favorites</h1>

      {loading && token && <Loader message="Loading saved favorites..." />}
      <ErrorMessage message={error} onRetry={refresh} />

      {!token && (
        <section className="min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
          <Heart size={24} color="#ffa52f" />
          <h2 className="mt-3 mb-[18px] text-lg font-semibold">
            Guest favorites
          </h2>
          <p className="text-[var(--muted)]">
            Guest favorites are saved in this browser. Sign in to save favorites
            to your PostgreSQL account.
          </p>

          <form className="mb-3 flex flex-wrap items-stretch gap-3" onSubmit={addGuestFavorite}>
            <label className="min-w-[160px] flex-1">
              <span className="sr-only">City to add to favorites</span>
              <input
                className="w-full rounded-[15px] border border-transparent bg-[var(--card)] px-4 py-[15px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                value={guestCityInput}
                onChange={(event) => setGuestCityInput(event.target.value)}
                placeholder="Enter a city name"
              />
            </label>
            <button
              className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--accent)] px-4 py-2.5 font-semibold text-[#151b26] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!guestCityInput.trim()}
            >
              <Plus size={16} />
              Add city
            </button>
          </form>

          <button
            className="mb-3 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={loadGuestWeather}
            disabled={guestLoading || guestFavorites.length === 0}
          >
            {guestLoading ? "Loading..." : "Load favorite weather"}
          </button>

          {guestFavorites.length === 0 && (
            <p className="p-7 text-center text-[var(--muted)]">
              No guest favorites yet. Add a city above or use the heart buttons on the dashboard.
            </p>
          )}
          {guestFavorites.length > 0 && (guestWeather === null || guestLoading) && (
            <Loader message="Loading guest favorite weather..." />
          )}
          {guestWeatherError && (
            <ErrorMessage message={guestWeatherError} onRetry={loadGuestWeather} />
          )}

          <div className="mt-[18px] grid grid-cols-1 gap-[14px] min-[681px]:grid-cols-2 min-[1051px]:grid-cols-4">
            {(guestWeather || []).map(({ city, weather, error: weatherError }) => (
              <div key={city}>
                {weather && (
                  <WeatherCard
                    weather={weather}
                    favorite
                    onSelect={() =>
                      navigate(`/city/${encodeURIComponent(weather.location.name)}`)
                    }
                  />
                )}
                {weatherError && <ErrorMessage message={weatherError} />}
                <button
                  className="mt-2 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)]"
                  onClick={() => {
                    const nextFavorites = guestFavorites.filter(
                      (favorite) => favorite.toLowerCase() !== city.toLowerCase()
                    );
                    localStorage.setItem(
                      "weatherworld_guest_favorites",
                      JSON.stringify(nextFavorites)
                    );
                    setGuestFavorites(nextFavorites);
                    setGuestWeather(null);
                  }}
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            ))}
          </div>

          {guestFavorites.length > 0 && (
            <button
              className="mt-[14px] inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)]"
              onClick={() => {
                localStorage.removeItem("weatherworld_guest_favorites");
                setGuestFavorites([]);
                setGuestWeather(null);
              }}
            >
              <Trash2 size={16} />
              Clear guest favorites
            </button>
          )}
        </section>
      )}

      {token && (
        <section className="min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
          {favorites.length === 0 && !loading ? (
            <div className="flex flex-col items-center p-7 text-center text-[var(--muted)]">
              <Heart size={28} />
              <p>No saved favorites yet.</p>
            </div>
          ) : favorites.length > 0 && (
            <>
              {favorites.some((favorite) => !favoriteWeather[favorite.id]) && (
                <Loader message="Loading favorite weather..." />
              )}
              <div className="mt-[18px] grid grid-cols-1 gap-[14px] min-[681px]:grid-cols-2 min-[1051px]:grid-cols-4">
                {favorites.map((favorite) => {
                  const weatherResult = favoriteWeather[favorite.id];

                  return (
                    <div key={favorite.id}>
                      {weatherResult?.weather && (
                        <WeatherCard
                          weather={weatherResult.weather}
                          favorite
                          onSelect={() =>
                            navigate(`/city/${encodeURIComponent(favorite.city_name)}`)
                          }
                        />
                      )}
                      {weatherResult?.error && (
                        <ErrorMessage message={weatherResult.error} />
                      )}

                      <button
                        className="mt-2 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)]"
                        onClick={() => remove(favorite.id)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
