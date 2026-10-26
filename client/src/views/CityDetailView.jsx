import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

import useWeather from "../controllers/useWeather";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import CurrentConditions from "../components/weather/CurrentConditions";
import HourlyForecast from "../components/weather/HourlyForecast";
import DailyForecast from "../components/weather/DailyForecast";
import TemperatureChart from "../components/charts/TemperatureChart";
import PrecipitationChart from "../components/charts/PrecipitationChart";

export default function CityDetailView() {
  const { city } = useParams();
  const navigate = useNavigate();
  const cityName = decodeURIComponent(city || "Nairobi");
  const { weather, loading, error, refresh } = useWeather(cityName);

  return (
    <>
      <button
        className="secondary-button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 18 }}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <h1 className="page-heading">
        <MapPin size={22} style={{ display: "inline", marginRight: 8 }} />
        {cityName} weather
      </h1>

      {loading && <Loader />}
      <ErrorMessage message={error} onRetry={refresh} />

      {weather && (
        <>
          <CurrentConditions weather={weather} />
          <HourlyForecast weather={weather} />
          <DailyForecast weather={weather} />

          <div className="dashboard-lower">
            <TemperatureChart weather={weather} />
            <PrecipitationChart weather={weather} />
          </div>
        </>
      )}
    </>
  );
}
