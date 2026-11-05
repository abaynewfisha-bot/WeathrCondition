import { getWeatherDescription } from "./weatherCodes";

function forecastDate(value) {
  if (!value) return "the forecast period";

  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
}

export function getWeatherAlerts(weather) {
  const daily = weather?.daily;
  if (!daily?.time?.length) return [];

  const alerts = [];
  const addFirstMatch = (matches, title, getDescription, severity = "moderate") => {
    const index = matches?.findIndex(Boolean) ?? -1;
    if (index < 0) return;

    alerts.push({
      id: title,
      title,
      severity,
      description: `${getDescription(index)} Expected ${forecastDate(daily.time[index])}.`
    });
  };

  addFirstMatch(
    daily.weather_code?.map((code) => [95, 96, 99].includes(code)),
    "Thunderstorm risk",
    (index) => getWeatherDescription(daily.weather_code[index]),
    "high"
  );
  addFirstMatch(
    daily.precipitation_sum?.map((amount) => amount >= 20),
    "Heavy rainfall",
    (index) => `Around ${Math.round(daily.precipitation_sum[index])} mm of precipitation is forecast.`,
    "high"
  );
  addFirstMatch(
    daily.wind_speed_10m_max?.map((speed) => speed >= 60),
    "Strong winds",
    (index) => `Wind speeds may reach ${Math.round(daily.wind_speed_10m_max[index])} km/h.`,
    "high"
  );
  addFirstMatch(
    daily.temperature_2m_max?.map((temperature) => temperature >= 35),
    "High-temperature advisory",
    (index) => `The maximum temperature may reach ${Math.round(daily.temperature_2m_max[index])}°C.`
  );
  addFirstMatch(
    daily.temperature_2m_min?.map((temperature) => temperature <= -10),
    "Extreme-cold advisory",
    (index) => `The minimum temperature may fall to ${Math.round(daily.temperature_2m_min[index])}°C.`,
    "high"
  );
  addFirstMatch(
    daily.uv_index_max?.map((uvIndex) => uvIndex >= 8),
    "High UV advisory",
    (index) => `The maximum UV index is forecast to reach ${Math.round(daily.uv_index_max[index])}.`
  );

  return alerts;
}
