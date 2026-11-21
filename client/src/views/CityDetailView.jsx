import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";

import useWeather from "../controllers/useWeather";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import CurrentConditions from "../components/weather/CurrentConditions";
import HourlyForecast from "../components/weather/HourlyForecast";
import DailyForecast from "../components/weather/DailyForecast";
import TemperatureChart from "../components/charts/TemperatureChart";
import PrecipitationChart from "../components/charts/PrecipitationChart";
import { getWeatherByCoordinates } from "../services/weatherService";

export default function CityDetailView() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityName = decodeURIComponent(city || "Nairobi");
  const latitudeParam = searchParams.get("lat");
  const longitudeParam = searchParams.get("lng");
  const latitude = Number(latitudeParam);
  const longitude = Number(longitudeParam);
  const hasCoordinates =
    latitudeParam !== null &&
    longitudeParam !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);
  const cityWeather = useWeather(hasCoordinates ? "" : cityName);
  const coordinateKey = hasCoordinates ? `${latitude},${longitude}` : "";
  const [coordinateResult, setCoordinateResult] = useState({
    key: "",
    weather: null,
    loading: false,
    error: ""
  });

  useEffect(() => {
    if (!hasCoordinates) return undefined;

    let active = true;

    getWeatherByCoordinates(latitude, longitude)
      .then((weather) => {
        if (active) {
          setCoordinateResult({
            key: coordinateKey,
            weather,
            loading: false,
            error: ""
          });
        }
      })
      .catch((err) => {
        if (active) {
          setCoordinateResult({
            key: coordinateKey,
            weather: null,
            loading: false,
            error:
              err.response?.data?.error ||
              "Unable to load weather for these coordinates."
          });
        }
      })
      ;

    return () => {
      active = false;
    };
  }, [coordinateKey, hasCoordinates, latitude, longitude]);

  const coordinateResultMatches = coordinateResult.key === coordinateKey;
  const coordinateWeather = coordinateResultMatches
    ? coordinateResult.weather
    : null;
  const coordinateLoading = hasCoordinates &&
    (coordinateResult.loading || !coordinateResultMatches);
  const coordinateError = coordinateResultMatches
    ? coordinateResult.error
    : "";
  const weather = hasCoordinates ? coordinateWeather : cityWeather.weather;
  const loading = hasCoordinates ? coordinateLoading : cityWeather.loading;
  const error = hasCoordinates ? coordinateError : cityWeather.error;
  const refresh = hasCoordinates
    ? () => {
        setCoordinateResult((current) => ({
          ...current,
          key: coordinateKey,
          loading: true,
          error: ""
        }));
        getWeatherByCoordinates(latitude, longitude)
          .then((result) => {
            setCoordinateResult({
              key: coordinateKey,
              weather: result,
              loading: false,
              error: ""
            });
          })
          .catch((err) => {
            setCoordinateResult({
              key: coordinateKey,
              weather: null,
              loading: false,
              error:
                err.response?.data?.error ||
                "Unable to load weather for these coordinates."
            });
          });
      }
    : cityWeather.refresh;

  return (
    <>
      <button
        className="mb-[18px] inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#293a52] px-3 text-[#e7edf7] hover:border-[#ffa52f]"
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
