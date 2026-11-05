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
    <section className="mt-[18px] min-w-0 rounded-[20px] bg-[#111d30] p-4 sm:p-5">
      <h2 className="mb-[18px] text-lg font-semibold">Hourly forecast</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {time.slice(start, start + 12).map((hour, index) => {
          const i = start + index;

          return (
            <div className="min-w-[82px] rounded-xl bg-[#172438] p-3 text-center" key={hour}>
              <div className="text-xs text-[#91a5bf]">{formatHour(hour)}</div>
              <div className="my-3 text-[25px]">
                {getWeatherEmoji(weather.current?.weather_code)}
              </div>
              <strong>{formatTemperature(temperature_2m[i], unit)}°</strong>
              <div className="mt-[9px] flex items-center justify-center gap-1 text-xs text-[#91a5bf]">
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
