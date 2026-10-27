import { AlertTriangle } from "lucide-react";

export default function WeatherAlerts({ alerts = [] }) {
  return (
    <section className="panel">
      <h2 className="section-title">Weather alerts</h2>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle size={25} />
          <p>No significant weather advisories were found in the 7-day forecast.</p>
          <p className="muted">
            Forecast-based advisories are not a substitute for official local warnings.
          </p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={alert.id || index}
            className={`weather-alert weather-alert--${alert.severity || "moderate"}`}
          >
            <strong>
              <AlertTriangle size={17} />
              {alert.title}
            </strong>
            <p>{alert.description}</p>
          </div>
        ))
      )}
    </section>
  );
}
