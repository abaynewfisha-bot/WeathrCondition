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
    <section className="panel section-spacing">
      <h2 className="section-title">Hourly forecast</h2>
      <div className="hourly-list">
        {time.slice(start, start + 12).map((hour, index) => {
          const i = start + index;

          return (
            <div className="hourly-item" key={hour}>
              <div className="muted">{formatHour(hour)}</div>
              <div style={{ fontSize: 25, margin: "12px 0" }}>
                {getWeatherEmoji(weather.current?.weather_code)}
              </div>
              <strong>{formatTemperature(temperature_2m[i], unit)}°</strong>
              <div className="muted" style={{ marginTop: 9, fontSize: 12 }}>
                <Droplets size={13} style={{ display: "inline" }} />{" "}
                {precipitation_probability[i] ?? 0}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
