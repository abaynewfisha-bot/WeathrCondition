import { Droplets } from "lucide-react";
import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { formatHour } from "../../utils/formatDate";
import { getWeatherEmoji } from "../../utils/weatherCodes";
import { useLanguage } from "../../context/LanguageContext";

export default function HourlyForecast({ weather }) {
  const { unit } = useUnit();
  const { t } = useLanguage();

  if (!weather?.hourly) return null;

  const { time = [], temperature_2m = [], precipitation_probability = [] } =
    weather.hourly;

  const currentTime = weather.current?.time;
  let start = currentTime ? time.findIndex((value) => value >= currentTime) : 0;
  if (start < 0) start = 0;

  return (
    <section className="min-w-0 rounded-[18px] bg-white p-4 text-[#17243a] sm:p-5">
      <h2 className="mb-[14px] text-lg font-bold">{t("hourlyForecast")}</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {time.slice(start, start + 12).map((hour, index) => {
          const i = start + index;

          return (
            <div className={`min-w-[82px] rounded-[12px] p-3 text-center ${index === 0 ? "bg-[#1d73dd] text-white" : "bg-[#eef1ff]"}`} key={hour}>
              <div className={`text-xs ${index === 0 ? "text-white" : "text-[#4b5b72]"}`}>{index === 0 ? t("now") : formatHour(hour)}</div>
              <div className="my-2 text-[25px]">
                {getWeatherEmoji(weather.current?.weather_code)}
              </div>
              <strong>{formatTemperature(temperature_2m[i], unit)}</strong>
              <div className={`mt-2 flex items-center justify-center gap-1 text-xs ${index === 0 ? "text-white/75" : "text-[#718197]"}`}>
                <Droplets size={13} />{" "}
                {precipitation_probability[i] ?? 0}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
