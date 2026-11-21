import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { formatDay } from "../../utils/formatDate";
import { getWeatherDescription, getWeatherEmoji } from "../../utils/weatherCodes";
import { useLanguage } from "../../context/LanguageContext";

export default function DailyForecast({ weather }) {
  const { unit } = useUnit();
  const { t } = useLanguage();

  if (!weather?.daily) return null;

  const {
    time = [],
    weather_code = [],
    temperature_2m_max = [],
    temperature_2m_min = [],
    precipitation_probability_max = []
  } = weather.daily;

  return (
    <section className="min-w-0 rounded-[18px] bg-white p-4 text-[#17243a] sm:p-5">
      <div className="mb-[14px] flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("sevenDay")}</h2>
        <button className="text-xs font-bold text-[#9a52a6]">{t("viewDetails")} →</button>
      </div>
      <div className="grid grid-cols-2 gap-3 min-[681px]:grid-cols-4 min-[1051px]:grid-cols-7">
        {time.map((day, index) => (
          <div className="min-w-0 border-r border-[#ecedf3] p-3 text-center last:border-r-0" key={day}>
            <div className="text-xs text-[#91a5bf]">{index === 0 ? t("today") : formatDay(day, { short: true })}</div>
            <div className="my-2 text-[28px]">
              {getWeatherEmoji(weather_code[index])}
            </div>
            <div title={getWeatherDescription(weather_code[index])} className="truncate text-[11px] text-[#91a5bf]">
              {getWeatherDescription(weather_code[index])}
            </div>
            <div className="mt-3 flex justify-center gap-2 text-sm font-semibold">
              <span>{formatTemperature(temperature_2m_max[index], unit)}</span>
              <span className="text-[#91a5bf]">{formatTemperature(temperature_2m_min[index], unit)}</span>
            </div>
            <div className="mt-2 text-xs text-[#91a5bf]">
              Rain {precipitation_probability_max[index] ?? 0}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
