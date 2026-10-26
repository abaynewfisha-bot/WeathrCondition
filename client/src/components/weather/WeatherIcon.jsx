import { Cloud, CloudRain, CloudSnow, Sun, CloudSun, CloudLightning } from "lucide-react";

export default function WeatherIcon({ code = 0, size = 28 }) {
  if ([0, 1].includes(code)) return <Sun size={size} color="#ffa52f" />;
  if ([2, 3, 45, 48].includes(code)) return <CloudSun size={size} color="#91a5bf" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return <CloudRain size={size} color="#7fb0df" />;
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudSnow size={size} color="#b9d7f2" />;
  }
  if ([95, 96, 99].includes(code)) {
    return <CloudLightning size={size} color="#ffa52f" />;
  }

  return <Cloud size={size} color="#91a5bf" />;
}
