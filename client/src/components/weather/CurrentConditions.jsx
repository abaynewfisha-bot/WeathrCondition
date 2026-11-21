import { Droplets, Eye, MapPin, Wind } from "lucide-react";
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
    <section className={`relative flex min-w-0 items-end overflow-hidden rounded-[18px] ${background} p-4 ${
      compact ? "min-h-[285px] sm:min-h-[285px]" : "min-h-[285px]"
    }`}>
      {compact && (
        <div className="pointer-events-none absolute bottom-6 right-0 h-[210px] w-[250px] opacity-95 sm:right-4 sm:h-[220px] sm:w-[270px]">
          <WeatherScene code={current.weather_code} />
        </div>
      )}
      <div className="relative z-10 w-full self-start p-[10px]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-[#9fffa2]" />
          Live Weather
        </div>
        <div className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
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
          <span className="text-sm text-[#ffd27a]">
            Feels like {formatTemperature(current.apparent_temperature, unit)}{unit}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-3 bg-[rgba(7,29,58,.64)] px-5 py-3 backdrop-blur-md">
        <span className="flex items-center justify-center gap-2 border-r border-white/25 text-sm">
          <Droplets size={20} className="text-[#4eb4ff]" />
          <span><strong className="block">{current.relative_humidity_2m}%</strong><small className="block text-white/70">Humidity</small></span>
        </span>
        <span className="flex items-center justify-center gap-2 border-r border-white/25 text-sm">
          <Wind size={20} className="text-[#67c0d6]" />
          <span><strong className="block">{windValue}</strong><small className="block text-white/70">Wind Speed</small></span>
        </span>
        <span className="flex items-center justify-center gap-2 text-sm">
          <Eye size={20} className="text-[#7dc8d1]" />
          <span><strong className="block">{Math.round((current.visibility ?? 10000) / 1000)} km</strong><small className="block text-white/70">Visibility</small></span>
        </span>
      </div>
    </section>
  );
}
