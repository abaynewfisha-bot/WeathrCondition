import { Droplets } from "lucide-react";
import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { formatHour } from "../../utils/formatDate";
import { getWeatherEmoji } from "../../utils/weatherCodes";

export default function HourlyForecast({ weather }) {
  const { unit } = useUnit();

  if (!weather?.hourly) return null;

  const { time = [], temperature_2m = [], precipitation_probability = [] } =
    weather.hourly;

  const currentTime = weather.current?.time;
  let start = currentTime ? time.findIndex((value) => value >= currentTime) : 0;
  if (start < 0) start = 0;

  return (
    <section className="mt-5 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
      <h2 className="mb-[18px] text-lg font-semibold">Hourly forecast</h2>
      <div className="grid grid-cols-[repeat(8,minmax(85px,1fr))] gap-[10px] overflow-x-auto">
        {time.slice(start, start + 12).map((hour, index) => {
          const i = start + index;

          return (
            <div className="min-w-[85px] rounded-[14px] bg-[var(--card)] px-2 py-[15px] text-center" key={hour}>
              <div className="text-[var(--muted)]">{formatHour(hour)}</div>
              <div className="my-3 text-[25px]">
                {getWeatherEmoji(weather.current?.weather_code)}
              </div>
              <strong>{formatTemperature(temperature_2m[i], unit)}°</strong>
              <div className="mt-[9px] text-xs text-[var(--muted)]">
                <Droplets className="inline" size={13} />{" "}
                {precipitation_probability[i] ?? 0}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
