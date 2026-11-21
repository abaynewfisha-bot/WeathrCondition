import { Car, Shirt, Sun, Sunrise, ThermometerSun } from "lucide-react";

import useWeather from "../controllers/useWeather";
import CurrentConditions from "../components/weather/CurrentConditions";
import DailyForecast from "../components/weather/DailyForecast";
import HourlyForecast from "../components/weather/HourlyForecast";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatHour } from "../utils/formatDate";
import { formatTemperature } from "../utils/convertTemp";
import { useUnit } from "../context/UnitContext";
import { useLanguage } from "../context/LanguageContext";

export default function DashboardView({ cityName = "Nairobi" }) {
  const { weather, loading, error, refresh } = useWeather(cityName);
  const { unit } = useUnit();
  const { t } = useLanguage();

  return (
    <>
      {loading && <Loader message={`Loading weather for ${cityName}...`} />}

      {!loading && <ErrorMessage message={error} onRetry={refresh} />}

      {weather && (
        <>
          <div className="grid grid-cols-1 items-stretch gap-[14px] min-[1051px]:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <CurrentConditions weather={weather} compact />

            <div className="grid gap-[14px]">
              <section className="min-h-[170px] rounded-[18px] bg-[linear-gradient(135deg,#8a83e8,#a08de2)] p-5 text-white shadow-[0_12px_28px_rgba(78,76,150,.12)]">
                <h2 className="mb-4 text-lg font-bold">{t("highlights")}</h2>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3"><Sun className="text-[#ffd45a]" fill="#ffd45a" size={28} /><span>{t("perfectWeather")}</span></div>
                  <div className="flex items-center gap-3"><Shirt className="text-[#6fd1ff]" fill="#7ed7ff" size={28} /><span>{t("wearLight")}</span></div>
                  <div className="flex items-center gap-3"><Car className="text-[#ffd45a]" fill="#ffd45a" size={28} /><span>{t("goodDriving")}</span></div>
                </div>
              </section>

              <section className="rounded-[18px] bg-[linear-gradient(135deg,#a68adf,#d09bc2)] p-4 text-white">
                <h2 className="mb-3 flex items-center gap-2 text-base font-bold"><Sunrise size={21} className="text-[#ffd45a]" />{t("sunriseSunset")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div><strong>{formatHour(weather.daily?.sunrise?.[0])}</strong><div className="text-xs text-white/80">{t("sunrise")}</div></div>
                  <div><strong>{formatHour(weather.daily?.sunset?.[0])}</strong><div className="text-xs text-white/80">{t("sunset")}</div></div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-[14px] grid grid-cols-1 items-stretch gap-[14px] min-[1051px]:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <HourlyForecast weather={weather} />
            <section className="rounded-[18px] bg-[linear-gradient(135deg,#fff4c9,#ffc95f)] p-5 text-[#17243a]">
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold"><ThermometerSun size={21} className="text-[#1a92e8]" />{t("currentConditions")}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-baseline text-[44px] font-extrabold leading-none">{formatTemperature(weather.current.temperature_2m, unit)}{unit}</div>
                <Sun size={38} className="text-[#ffad32]" fill="#ffad32" />
                <span className="text-sm font-semibold text-[#7d5b35]">{t("feelsLike")}<br /><strong className="text-lg">{formatTemperature(weather.current.apparent_temperature, unit)}{unit}</strong></span>
              </div>
            </section>
          </div>

          <div className="mt-[14px]">
            <DailyForecast weather={weather} />
          </div>
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
