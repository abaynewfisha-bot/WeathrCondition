export default function AirQualityBadge({ value }) {
  if (value === undefined || value === null) {
    return (
      <span className="muted">
        Air quality data unavailable
      </span>
    );
  }

  let label = "Good";
  if (value > 50) label = "Moderate";
  if (value > 100) label = "Unhealthy for sensitive groups";
  if (value > 150) label = "Unhealthy";
  if (value > 200) label = "Very unhealthy";
  if (value > 300) label = "Hazardous";

  return (
    <span className="stat">
      Air quality: <strong>{label}</strong> ({value})
    </span>
  );
}
