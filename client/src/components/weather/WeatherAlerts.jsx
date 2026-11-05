import { AlertTriangle } from "lucide-react";

export default function WeatherAlerts({ alerts = [] }) {
  return (
    <section className="min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
      <h2 className="mb-[18px] text-lg font-semibold">Weather alerts</h2>

      {alerts.length === 0 ? (
        <div className="p-7 text-center text-[var(--muted)]">
          <AlertTriangle size={25} />
          <p className="my-3">No significant weather advisories were found in the 7-day forecast.</p>
          <p className="text-[var(--muted)]">
            Forecast-based advisories are not a substitute for official local warnings.
          </p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={alert.id || index}
            className={`my-3 rounded-xl border border-[var(--border)] border-l-4 bg-[var(--card)] p-4 ${
              alert.severity === "high" ? "border-l-[#e05252]" : "border-l-[#e58b13]"
            }`}
          >
            <strong className="flex items-center gap-2">
              <AlertTriangle size={17} />
              {alert.title}
            </strong>
            <p className="mt-2 text-[var(--muted)]">{alert.description}</p>
          </div>
        ))
      )}
    </section>
  );
}
