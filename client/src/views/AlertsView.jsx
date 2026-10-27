
import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import useWeather from "../controllers/useWeather";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import WeatherAlerts from "../components/weather/WeatherAlerts";
import { getWeatherAlerts } from "../utils/weatherAlerts";

export default function AlertsView({ cityName: initialCity = "Nairobi" }) {
  const [cityName, setCityName] = useState(initialCity);
  const [query, setQuery] = useState(initialCity);
  const { weather, loading, error, refresh } = useWeather(cityName);

  function searchCity(event) {
    event.preventDefault();
    const nextCity = query.trim();
    if (nextCity) setCityName(nextCity);
  }

  return (
    <>
      <h1 className="page-heading">Weather alerts</h1>
      <section className="panel">
        <p className="muted">
          Forecast-based advisories for severe weather conditions in the next 7 days.
          These are not official emergency warnings.
        </p>
        <form className="card-row alert-search" onSubmit={searchCity}>
          <label className="alert-search-field">
            <span className="sr-only">City for weather alerts</span>
            <input
              className="search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a city"
            />
          </label>
          <button className="primary-button" type="submit">
            <Search size={16} />
            Check alerts
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh weather alerts"
          >
            <RefreshCw size={16} />
          </button>
        </form>

        <h2 className="section-title section-spacing">
          {weather?.location?.name || cityName}
          {weather?.location?.country ? `, ${weather.location.country}` : ""}
        </h2>
        {loading && <Loader message={`Checking the forecast for ${cityName}...`} />}
        <ErrorMessage message={error} onRetry={refresh} />
        {!loading && !error && (
          <WeatherAlerts alerts={getWeatherAlerts(weather)} />
        )}
      </section>
    </>
  );
}
