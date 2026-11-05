import { Droplets, Gauge, MapPin, Wind } from "lucide-react";
import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { getWeatherDescription } from "../../utils/weatherCodes";
import WeatherIcon from "./WeatherIcon";

export default function CurrentConditions({ weather }) {
  const { unit } = useUnit();

  if (!weather?.current) return null;

  const { current, location, units } = weather;
  const wind = current.wind_speed_10m;
  const windValue = units?.current?.wind_speed_10m === "mph"
    ? `${Math.round(wind)} mph`
    : `${Math.round(wind)} km/h`;

  return (
    <section className="relative flex min-h-[285px] items-center overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_10%_26%,#ffb33c_0_7%,#b55f27_7.1%_12%,#563820_12.1%_18%,transparent_18.1%),radial-gradient(ellipse_at_80%_70%,#294260_0_20%,transparent_20.2%),var(--panel)] p-4">
      <div className="relative z-10 max-w-full p-[10px] sm:max-w-[70%]">
        <div className="flex items-center gap-2 text-xl text-[#e2e9f3]">
          <MapPin size={19} />
          {location?.name}, {location?.country}
        </div>

        <div className="mt-3 text-[clamp(56px,8vw,84px)] font-extrabold leading-none">
          {formatTemperature(current.temperature_2m, unit)}
          {unit === "C" ? "C" : "F"}
        </div>

        <div className="mt-[10px] flex flex-wrap items-center gap-2 text-xl">
          <WeatherIcon code={current.weather_code} size={24} />
          <span>{getWeatherDescription(current.weather_code)}</span>
          <span className="text-sm text-[var(--muted)]">
            Feels like {formatTemperature(current.apparent_temperature, unit)}°
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-[18px] text-[#d7e0ed]">
          <span className="inline-flex items-center gap-[7px]">
            <Droplets size={18} />
            {current.relative_humidity_2m}% humidity
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
