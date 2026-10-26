import { useUnit } from "../../context/UnitContext";
import { formatTemperature } from "../../utils/convertTemp";
import { formatDay } from "../../utils/formatDate";
import { getWeatherDescription, getWeatherEmoji } from "../../utils/weatherCodes";

export default function DailyForecast({ weather }) {
  const { unit } = useUnit();

  if (!weather?.daily) return null;

  const {
    time = [],
    weather_code = [],
    temperature_2m_max = [],
    temperature_2m_min = [],
    precipitation_probability_max = []
  } = weather.daily;

  return (
    <section className="panel section-spacing">
      <h2 className="section-title">7-day forecast</h2>
      <div className="forecast-grid">
        {time.map((day, index) => (
          <div className="forecast-day" key={day}>
            <div className="muted">{index === 0 ? "Today" : formatDay(day, { short: true })}</div>
            <div className="forecast-icon" style={{ fontSize: 28 }}>
              {getWeatherEmoji(weather_code[index])}
            </div>
            <div title={getWeatherDescription(weather_code[index])} className="muted" style={{ fontSize: 11 }}>
              {getWeatherDescription(weather_code[index])}
            </div>
            <div className="forecast-temperature" style={{ marginTop: 12 }}>
              <span>{formatTemperature(temperature_2m_max[index], unit)}°</span>
              <span className="muted">{formatTemperature(temperature_2m_min[index], unit)}°</span>
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Rain {precipitation_probability_max[index] ?? 0}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
