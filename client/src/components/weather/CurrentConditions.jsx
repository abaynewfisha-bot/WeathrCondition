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
    <section className="panel hero-weather">
      <div className="hero-info">
        <div className="hero-location">
          <MapPin size={19} />
          {location?.name}, {location?.country}
        </div>

        <div className="hero-temperature">
          {formatTemperature(current.temperature_2m, unit)}
          {unit === "C" ? "C" : "F"}
        </div>

        <div className="hero-description">
          <WeatherIcon code={current.weather_code} size={24} />
          <span>{getWeatherDescription(current.weather_code)}</span>
          <span className="muted">
            Feels like {formatTemperature(current.apparent_temperature, unit)}°
          </span>
        </div>

        <div className="weather-stats">
          <span className="stat">
            <Droplets size={18} />
            {current.relative_humidity_2m}% humidity
          </span>
          <span className="stat">
            <Wind size={18} />
            {windValue}
          </span>
          <span className="stat">
            <Gauge size={18} />
            {Math.round(current.surface_pressure)} hPa
          </span>
        </div>
      </div>
    </section>
  );
}
