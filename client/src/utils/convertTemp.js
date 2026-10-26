// convertTemp helpers
export function convertTemp(celsius, unit = "C") {
  if (celsius === null || celsius === undefined || Number.isNaN(Number(celsius))) {
    return "--";
  }

  const value = unit === "F"
    ? (Number(celsius) * 9) / 5 + 32
    : Number(celsius);

  return Math.round(value);
}

export function formatTemperature(celsius, unit = "C") {
  const value = convertTemp(celsius, unit);
  return value === "--" ? value : `${value}°`;
}
