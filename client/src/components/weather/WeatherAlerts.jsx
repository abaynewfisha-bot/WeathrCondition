import { AlertTriangle } from "lucide-react";

export default function WeatherAlerts({ alerts = [] }) {
  return (
    <section className="panel">
      <h2 className="section-title">Weather alerts</h2>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle size={25} />
          <p>No official alerts are available from the current weather provider.</p>
          <p className="muted">
            This does not confirm that no local weather warnings exist.
          </p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div key={alert.id || index} className="error-message">
            <strong>{alert.title}</strong>
            <p>{alert.description}</p>
          </div>
        ))
      )}
    </section>
  );
}
