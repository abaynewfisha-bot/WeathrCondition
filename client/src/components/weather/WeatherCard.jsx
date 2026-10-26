import { Star } from "lucide-react";
import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import WeatherIcon from "./WeatherIcon";

export default function WeatherCard({ weather, onSelect, favorite = false }) {
  if (!weather) return null;

  const { unit } = useUnit();
  const current = weather.current || {};
  const city = weather.location || {};

  return (
    <button className="city-card" onClick={onSelect}>
      <div>
        <div className="city-card-name">
          {city.name || "Unknown city"}
          {city.country ? `, ${city.country}` : ""}
        </div>
        <div className="city-card-temperature">
          {formatTemperature(current.temperature_2m, unit)}
        </div>
      </div>
      <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
        <WeatherIcon code={current.weather_code} size={25} />
        {favorite && <Star size={15} color="#ffa52f" />}
      </div>
    </button>
  );
}
