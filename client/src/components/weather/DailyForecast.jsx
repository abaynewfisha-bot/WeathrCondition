import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { formatDay } from "../../utils/formatDate";
import { getWeatherDescription, getWeatherEmoji } from "../../utils/weatherCodes";

export default function DailyForecast({ weather }) {
  const { unit } = useUnit();

  if (!weather?.daily) return null;

  const {
    time = [],
    weather_code = [],
    temperature_2m_max = [],
    temperature_2m_min = [],
    precipitation_probability_max = []
  } = weather.daily;

  return (
    <section className="mt-5 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
      <h2 className="mb-[18px] text-lg font-semibold">7-day forecast</h2>
      <div className="grid grid-cols-[repeat(7,minmax(80px,1fr))] gap-[10px] overflow-x-auto">
        {time.map((day, index) => (
          <div className="min-w-[80px] rounded-[14px] bg-[var(--card)] px-2 py-[15px] text-center" key={day}>
            <div className="text-[var(--muted)]">{index === 0 ? "Today" : formatDay(day, { short: true })}</div>
            <div className="my-3 text-[28px] text-[var(--accent)]">
              {getWeatherEmoji(weather_code[index])}
            </div>
            <div title={getWeatherDescription(weather_code[index])} className="text-[11px] text-[var(--muted)]">
              {getWeatherDescription(weather_code[index])}
            </div>
            <div className="mt-3 flex justify-center gap-2 font-semibold">
              <span>{formatTemperature(temperature_2m_max[index], unit)}°</span>
              <span className="text-[var(--muted)]">{formatTemperature(temperature_2m_min[index], unit)}°</span>
            </div>
            <div className="mt-2 text-xs text-[var(--muted)]">
              Rain {precipitation_probability_max[index] ?? 0}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
