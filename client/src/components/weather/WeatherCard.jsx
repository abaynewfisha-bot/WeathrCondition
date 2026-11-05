import { Star } from "lucide-react";
import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import WeatherIcon from "./WeatherIcon";

export default function WeatherCard({ weather, onSelect, favorite = false, compact = false }) {
  const { unit } = useUnit();
  if (!weather) return null;

  const current = weather.current || {};
  const city = weather.location || {};

  return (
    <button
      className={`flex w-full items-center justify-between gap-2.5 rounded-[15px] border border-transparent bg-[#172438] text-left text-[#e7edf7] transition hover:-translate-y-px hover:border-[#ffa52f] ${
        compact ? "min-h-[82px] px-[14px] py-[11px]" : "p-[19px]"
      }`}
      onClick={onSelect}
    >
      <div>
        <div className="mb-[5px] text-sm text-[#91a5bf]">
          {city.name || "Unknown city"}
          {city.country ? `, ${city.country}` : ""}
        </div>
        <div className="text-[30px] font-bold">
          {formatTemperature(current.temperature_2m, unit)}
        </div>
      </div>
      <div className="grid justify-items-center gap-2">
        <WeatherIcon code={current.weather_code} size={25} />
        {favorite && <Star size={15} color="#ffa52f" />}
      </div>
    </button>
  );
}
