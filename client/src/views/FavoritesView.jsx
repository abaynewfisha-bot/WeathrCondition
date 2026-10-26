import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
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

  const [guestWeather, setGuestWeather] = useState([]);
  const [guestLoading, setGuestLoading] = useState(false);

  async function loadGuestWeather() {
    setGuestLoading(true);

    try {
      const results = await Promise.allSettled(
        guestFavorites.map((city) => getWeather(city))
      );

      setGuestWeather(
        results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
      );
    } finally {
      setGuestLoading(false);
    }
  }

  const token = localStorage.getItem("weatherworld_token");

  return (
    <>
      <h1 className="page-heading">Your favorites</h1>

      {loading && token && <Loader message="Loading saved favorites..." />}
      <ErrorMessage message={error} onRetry={refresh} />

      {!token && (
        <section className="panel">
          <Heart size={24} color="#ffa52f" />
          <h2 className="section-title" style={{ marginTop: 12 }}>
            Guest favorites
          </h2>
          <p className="muted">
            Guest favorites are saved in this browser. Sign in to save favorites
            to your PostgreSQL account.
          </p>

          <button
            className="secondary-button"
            onClick={loadGuestWeather}
            disabled={guestLoading || guestFavorites.length === 0}
          >
            {guestLoading ? "Loading..." : "Load favorite weather"}
          </button>

          {guestFavorites.length === 0 && (
            <p className="empty-state">
              You have no guest favorites. Use the heart buttons on the dashboard.
            </p>
          )}

          <div className="city-grid">
            {guestWeather.map((weather) => (
              <WeatherCard
                key={`${weather.location.name}-${weather.location.country}`}
                weather={weather}
                favorite
                onSelect={() =>
                  navigate(`/city/${encodeURIComponent(weather.location.name)}`)
                }
              />
            ))}
          </div>

          {guestFavorites.length > 0 && (
            <button
              className="secondary-button"
              style={{ marginTop: 14 }}
              onClick={() => {
                localStorage.removeItem("weatherworld_guest_favorites");
                setGuestFavorites([]);
                setGuestWeather([]);
              }}
            >
              <Trash2 size={16} />
              Clear guest favorites
            </button>
          )}
        </section>
      )}

      {token && (
        <section className="panel">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <Heart size={28} />
              <p>No saved favorites yet.</p>
            </div>
          ) : (
            <div className="city-grid">
              {favorites.map((favorite) => (
                <div key={favorite.id}>
                  <WeatherCard
                    weather={{
                      location: {
                        name: favorite.city_name,
                        country: favorite.country
                      },
                      current: {}
                    }}
                    onSelect={() =>
                      navigate(`/city/${encodeURIComponent(favorite.city_name)}`)
                    }
                  />

                  <button
                    className="secondary-button"
                    style={{ marginTop: 8 }}
                    onClick={() => remove(favorite.id)}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
