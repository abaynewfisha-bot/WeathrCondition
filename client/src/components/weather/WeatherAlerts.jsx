import { AlertTriangle } from "lucide-react";

export default function WeatherAlerts({ alerts = [] }) {
  return (
    <section className="mt-[18px] min-w-0 rounded-[20px] bg-[#111d30] p-4 sm:p-5">
      <h2 className="mb-[18px] text-lg font-semibold">Weather alerts</h2>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center p-7 text-center text-[#91a5bf]">
          <AlertTriangle size={25} />
          <p>No significant weather advisories were found in the 7-day forecast.</p>
          <p className="text-sm text-[#91a5bf]">
            Forecast-based advisories are not a substitute for official local warnings.
          </p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={alert.id || index}
            className={`mb-3 rounded-xl border border-[#293a52] border-l-4 bg-[#172438] p-4 ${
              alert.severity === "high" ? "border-l-[#e05252]" : "border-l-[#ffa52f]"
            }`}
          >
            <strong className="flex items-center gap-2">
              <AlertTriangle size={17} />
              {alert.title}
            </strong>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-[#91a5bf]">{alert.description}</p>
          </div>
        ))
      )}
    </section>
  );
}
