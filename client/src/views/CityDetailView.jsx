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
        className="mb-[18px] inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 text-[var(--text)] hover:border-[var(--accent)]"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <h1 className="mb-[18px] flex items-center gap-2 text-2xl font-bold">
        <MapPin size={22} />
        {cityName} weather
      </h1>

      {loading && <Loader />}
      <ErrorMessage message={error} onRetry={refresh} />

      {weather && (
        <>
          <CurrentConditions weather={weather} />
          <HourlyForecast weather={weather} />
          <DailyForecast weather={weather} />

          <div className="mt-[18px] grid grid-cols-1 gap-4 min-[1051px]:grid-cols-2">
            <TemperatureChart weather={weather} />
            <PrecipitationChart weather={weather} />
          </div>
        </>
      )}
    </>
  );
}
