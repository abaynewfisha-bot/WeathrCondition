import { Droplets, Gauge, MapPin, Wind } from "lucide-react";
import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { getWeatherDescription } from "../../utils/weatherCodes";
import WeatherIcon from "./WeatherIcon";
import WeatherScene from "./WeatherScene";

export default function CurrentConditions({ weather, compact = false }) {
  const { unit } = useUnit();

  if (!weather?.current) return null;

  const { current, location, units } = weather;
  const wind = current.wind_speed_10m;
  const windValue = units?.current?.wind_speed_10m === "mph"
    ? `${Math.round(wind)} mph`
    : `${Math.round(wind)} km/h`;
  const code = current.weather_code;
  const isStorm = [95, 96, 99].includes(code);
  const isRain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(code);
  const isCloudy = [2, 3, 45, 48].includes(code);
  const background = isStorm
    ? "bg-gradient-to-br from-[#263148] via-[#29425d] to-[#111d30]"
    : isRain || isSnow
      ? "bg-gradient-to-br from-[#40566d] via-[#2a405a] to-[#111d30]"
      : isCloudy
        ? "bg-gradient-to-br from-[#53657a] via-[#30465f] to-[#111d30]"
        : "bg-[radial-gradient(circle_at_10%_28%,rgba(255,179,60,0.98)_0_7%,rgba(181,95,39,0.95)_7.1%_12%,rgba(86,56,32,0.95)_12.1%_19%,transparent_19.1%),radial-gradient(ellipse_at_78%_72%,#294260_0_22%,transparent_22.2%),radial-gradient(ellipse_at_62%_87%,#1d2c43_0_18%,transparent_18.2%),#111d30]";

  return (
    <section className={`relative flex min-w-0 items-center overflow-hidden rounded-[20px] ${background} p-4 ${
      compact ? "min-h-[205px] sm:min-h-[210px]" : "min-h-[285px]"
    }`}>
      {compact && (
        <div className="pointer-events-none absolute bottom-1 right-0 h-[150px] w-[170px] opacity-90 sm:right-5 sm:h-[175px] sm:w-[205px]">
          <WeatherScene code={current.weather_code} />
        </div>
      )}
      <div className="relative z-10 max-w-full p-[10px] sm:max-w-[70%]">
        <div className="flex items-center gap-2 text-base text-[#e2e9f3] sm:text-lg">
          <MapPin size={19} aria-hidden="true" />
          {location?.name}, {location?.country}
        </div>

        <div className={`mt-2 font-extrabold leading-none ${compact ? "text-[clamp(48px,8vw,68px)]" : "text-[clamp(56px,8vw,84px)]"}`}>
          {formatTemperature(current.temperature_2m, unit)}
          {unit}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-base sm:text-lg">
          <WeatherIcon code={current.weather_code} size={24} />
          <span>{getWeatherDescription(current.weather_code)}</span>
          <span className="text-sm text-[#91a5bf]">
            Feels like {formatTemperature(current.apparent_temperature, unit)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#d7e0ed] sm:mt-5 sm:gap-[18px]">
          <span className="inline-flex items-center gap-[7px]">
            <Droplets size={18} />
            {current.relative_humidity_2m}%
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <Wind size={18} />
            {windValue}
          </span>
          <span className="inline-flex items-center gap-[7px]">
            <Gauge size={18} />
            {Math.round(current.surface_pressure)} hPa
          </span>
        </div>
      </div>
    </section>
  );
}
