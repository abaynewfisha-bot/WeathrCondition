import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDown,
  HeartPulse,
  Leaf,
  RefreshCw,
  Search,
  ShieldCheck,
  Wind
} from "lucide-react";
import useWeather from "../controllers/useWeather";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

const AQI_MAX = 500;
const AQI_CIRCUMFERENCE = 2 * Math.PI * 76;
const AQI_ARC_LENGTH = AQI_CIRCUMFERENCE * 0.78;

function getAqiCategory(value) {
  if (value <= 50) {
    return {
      label: "Good",
      summary: "Air quality is satisfactory.",
      advice: "Enjoy outdoor activities as usual.",
      color: "#31b889",
      level: "good"
    };
  }
  if (value <= 100) {
    return {
      label: "Moderate",
      summary: "Air quality is acceptable for most people.",
      advice: "Sensitive individuals should consider reducing prolonged outdoor exertion.",
      color: "#e5b642",
      level: "moderate"
    };
  }
  if (value <= 150) {
    return {
      label: "Unhealthy for sensitive groups",
      summary: "Sensitive groups may experience health effects.",
      advice: "Children, older adults, and people with heart or lung conditions should limit strenuous outdoor activity.",
      color: "#ed9148",
      level: "sensitive"
    };
  }
  if (value <= 200) {
    return {
      label: "Unhealthy",
      summary: "Everyone may begin to experience health effects.",
      advice: "Limit outdoor exertion and take more breaks when outside.",
      color: "#e76c70",
      level: "unhealthy"
    };
  }
  if (value <= 300) {
    return {
      label: "Very unhealthy",
      summary: "Health alert: everyone may experience more serious effects.",
      advice: "Avoid strenuous outdoor activity and keep windows closed where possible.",
      color: "#a16bd5",
      level: "very-unhealthy"
    };
  }
  return {
    label: "Hazardous",
    summary: "Health warning: everyone may experience serious effects.",
    advice: "Stay indoors where possible and follow local public-health guidance.",
    color: "#bc557e",
    level: "hazardous"
  };
}

function getAqiLevel(value) {
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Sensitive groups";
  if (value <= 200) return "Unhealthy";
  if (value <= 300) return "Very unhealthy";
  return "Hazardous";
}

export default function AlertsView({ cityName: initialCity = "Nairobi" }) {
  const [cityName, setCityName] = useState(initialCity);
  const [query, setQuery] = useState(initialCity);
  const { weather, loading, error, refresh } = useWeather(cityName);
  const [airQuality, setAirQuality] = useState({
    loading: false,
    value: null,
    pm25: null,
    error: ""
  });

  useEffect(() => {
    const latitude = Number(weather?.location?.latitude);
    const longitude = Number(weather?.location?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      if (!loading && !error) {
        setAirQuality({
          loading: false,
          value: null,
          pm25: null,
          error: "Air-quality data is unavailable for this location."
        });
      }
      return undefined;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: "us_aqi,pm2_5",
      timezone: "auto"
    });

    setAirQuality({ loading: true, value: null, pm25: null, error: "" });
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`, {
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error("Air-quality service is unavailable.");
        return response.json();
      })
      .then((data) => {
        const value = data.current?.us_aqi;
        if (!Number.isFinite(value)) {
          throw new Error("Air-quality data is unavailable for this location.");
        }
        setAirQuality({
          loading: false,
          value,
          pm25: Number.isFinite(data.current?.pm2_5) ? data.current.pm2_5 : null,
          error: ""
        });
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setAirQuality({
            loading: false,
            value: null,
            pm25: null,
            error: fetchError.message || "Unable to load air-quality data."
          });
        }
      });

    return () => controller.abort();
  }, [error, loading, weather?.location?.latitude, weather?.location?.longitude]);

  function searchCity(event) {
    event.preventDefault();
    const nextCity = query.trim();
    if (nextCity) setCityName(nextCity);
  }

  const currentCity = weather?.location?.name || cityName;
  const country = weather?.location?.country;
  const category = airQuality.value !== null ? getAqiCategory(airQuality.value) : null;
  const poorAirQuality = airQuality.value !== null && airQuality.value > 100;
  const progress = airQuality.value === null
    ? 0
    : Math.min(Math.max(airQuality.value / AQI_MAX, 0), 1);
  const gaugeOffset = AQI_ARC_LENGTH * (1 - progress);
  const recommendations = [
    {
      Icon: HeartPulse,
      title: "Protect your health",
      text: poorAirQuality
        ? "Reduce time outdoors, especially strenuous exercise. Sensitive groups should take extra care."
        : "Air quality is currently within a lower-risk range. Follow local guidance if you are sensitive to pollution."
    },
    {
      Icon: ShieldCheck,
      title: "Create a cleaner indoor space",
      text: poorAirQuality
        ? "Close windows when outdoor air is poor and use indoor air filtration if available."
        : "Keep up with local air-quality updates and close windows if conditions worsen."
    },
    {
      Icon: Wind,
      title: "Plan outdoor activity",
      text: poorAirQuality
        ? "Consider rescheduling outdoor activity or choosing a route away from busy roads."
        : "Outdoor plans are generally okay; sensitive individuals can choose lighter activity."
    }
  ];

  return (
    <main className="relative isolate min-w-0 overflow-hidden rounded-[30px] bg-[radial-gradient(ellipse_at_12%_10%,rgba(255,255,255,0.95),transparent_38%),linear-gradient(135deg,#fff1fc_0%,#f2e7ff_48%,#e9ecff_100%)] p-4 text-slate-800 shadow-[0_24px_70px_rgba(115,79,165,0.14)] sm:p-7 lg:p-9">
      <div className="pointer-events-none absolute -right-20 top-28 -z-10 h-64 w-64 rounded-full bg-[#bd77ef]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[28%] -z-10 h-64 w-64 rounded-full bg-[#f28dda]/20 blur-3xl" />

      <header className="mx-auto mb-7 flex w-full max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-600 shadow-sm">
            <Activity size={15} aria-hidden="true" />
            LIVE AIR MONITOR
          </span>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Air quality
          </h1>
          <p className="mb-0 mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Check the AQI, see whether air quality is poor, and get practical health recommendations.
          </p>
        </div>

        <form className="flex w-full gap-2 sm:w-auto" onSubmit={searchCity}>
          <label className="min-w-0 flex-1 sm:w-56">
            <span className="sr-only">City for air quality</span>
            <input
              className="h-11 w-full rounded-2xl border border-white/80 bg-white/75 px-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a city"
            />
          </label>
          <button
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(149,79,214,0.28)] transition hover:brightness-105"
            type="submit"
            aria-label="Check air quality"
          >
            <Search size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-violet-600 shadow-sm transition hover:bg-white disabled:opacity-60"
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh air quality"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={17} aria-hidden="true" />
          </button>
        </form>
      </header>

      <section className="mx-auto max-w-6xl" aria-label="Air quality for selected city">
        {loading && <Loader message={`Finding air quality for ${cityName}...`} />}
        <ErrorMessage message={error} onRetry={refresh} />

        {!loading && !error && (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/55 px-5 py-4 shadow-sm backdrop-blur-sm">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">
                  Monitoring location
                </span>
                <h2 className="mb-0 mt-1 text-lg font-bold text-slate-800">
                  {currentCity}{country ? `, ${country}` : ""}
                </h2>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-500">
                Current US AQI
              </span>
            </div>

            {airQuality.loading ? (
              <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_16px_40px_rgba(111,79,151,0.10)]">
                <Loader message={`Checking air quality for ${currentCity}...`} />
              </div>
            ) : category ? (
              <>
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <article className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(111,79,151,0.12)] backdrop-blur sm:p-7">
                    <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-fuchsia-200/40 blur-2xl" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600">
                          <Leaf size={17} aria-hidden="true" />
                          Air quality index
                        </span>
                        <p className="mb-0 mt-2 text-xs text-slate-500">US AQI · Updated now</p>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        poorAirQuality
                          ? "bg-rose-100 text-rose-600"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {poorAirQuality ? "Poor air quality" : "Air quality is good"}
                      </span>
                    </div>

                    <div className="relative mt-8 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <div>
                        <p className="mb-1 text-sm font-medium text-slate-500">Current AQI level</p>
                        <div className="flex items-baseline gap-2">
                          <strong className="text-6xl font-bold tracking-tight text-slate-800 sm:text-7xl">
                            {Math.round(airQuality.value)}
                          </strong>
                          <span className="text-sm font-semibold text-slate-400">/ {AQI_MAX}</span>
                        </div>
                        <p className="mb-0 mt-2 text-lg font-semibold" style={{ color: category.color }}>
                          {category.label}
                        </p>
                        <p className="mb-0 mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                          {category.summary}
                        </p>
                      </div>

                      <div className="relative mx-auto grid h-48 w-48 place-items-center sm:h-52 sm:w-52">
                        <svg
                          className="absolute inset-0 h-full w-full -rotate-[130deg]"
                          viewBox="0 0 180 180"
                          role="img"
                          aria-label={`AQI ${Math.round(airQuality.value)} out of ${AQI_MAX}`}
                        >
                          <circle
                            cx="90"
                            cy="90"
                            r="76"
                            fill="none"
                            stroke="#eee7f6"
                            strokeWidth="12"
                            strokeDasharray={`${AQI_ARC_LENGTH} ${AQI_CIRCUMFERENCE}`}
                            strokeLinecap="round"
                          />
                          <circle
                            cx="90"
                            cy="90"
                            r="76"
                            fill="none"
                            stroke={category.color}
                            strokeWidth="12"
                            strokeDasharray={`${AQI_ARC_LENGTH} ${AQI_CIRCUMFERENCE}`}
                            strokeDashoffset={gaugeOffset}
                            strokeLinecap="round"
                            className="transition-[stroke-dashoffset] duration-700"
                          />
                        </svg>
                        <div className="relative text-center">
                          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-violet-400">
                            AQI
                          </span>
                          <strong className="block text-4xl font-bold text-slate-800">
                            {Math.round(airQuality.value)}
                          </strong>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            0 <ArrowDown size={11} className="rotate-[-90deg]" aria-hidden="true" /> 500
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-violet-100 pt-4 text-xs text-slate-500">
                      <span className="font-semibold text-slate-600">{getAqiLevel(airQuality.value)} air</span>
                      {airQuality.pm25 !== null && (
                        <span>PM2.5: {airQuality.pm25.toFixed(1)} µg/m³</span>
                      )}
                    </div>
                  </article>

                  <aside className="rounded-[28px] bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-500 p-5 text-white shadow-[0_18px_42px_rgba(137,82,204,0.26)] sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
                          Health recommendation
                        </span>
                        <h2 className="mb-0 mt-2 text-2xl font-bold">What to do today</h2>
                      </div>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20">
                        <HeartPulse size={22} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mb-0 mt-5 text-sm leading-relaxed text-white/90">
                      {category.advice}
                    </p>

                    <div className="mt-6 grid gap-3">
                      {recommendations.map(({ Icon, title, text }) => (
                        <div className="flex gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm" key={title}>
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
                            <Icon size={17} aria-hidden="true" />
                          </span>
                          <div>
                            <h3 className="m-0 text-sm font-semibold">{title}</h3>
                            <p className="mb-0 mt-1 text-xs leading-relaxed text-white/80">{text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>

                <section className="mt-5 rounded-[26px] border border-white/80 bg-white/75 p-5 shadow-[0_12px_30px_rgba(111,79,151,0.08)] backdrop-blur sm:p-6" aria-labelledby="aqi-scale-heading">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-500">AQI guide</span>
                      <h2 className="mb-0 mt-1 text-lg font-bold text-slate-800" id="aqi-scale-heading">Understand the levels</h2>
                    </div>
                    <p className="mb-0 text-xs text-slate-500">Current level: {getAqiLevel(airQuality.value)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                      { range: "0–50", label: "Good", color: "#31b889" },
                      { range: "51–100", label: "Moderate", color: "#e5b642" },
                      { range: "101–150", label: "Sensitive groups", color: "#ed9148" },
                      { range: "151–200", label: "Unhealthy", color: "#e76c70" },
                      { range: "201–300", label: "Very unhealthy", color: "#a16bd5" },
                      { range: "301–500", label: "Hazardous", color: "#bc557e" }
                    ].map(({ range, label, color }) => (
                      <div
                        className={`rounded-2xl border p-3 ${
                          getAqiLevel(airQuality.value) === label
                            ? "border-violet-300 bg-violet-50 shadow-sm"
                            : "border-slate-100 bg-white/70"
                        }`}
                        key={label}
                      >
                        <span className="mb-2 block h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="block text-[10px] font-semibold text-slate-400">{range}</span>
                        <span className="mt-1 block text-xs font-bold leading-tight text-slate-700">{label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="rounded-[26px] border border-white/80 bg-white/80 p-6 shadow-sm" role="status">
                <h2 className="m-0 text-lg font-bold text-slate-800">Air-quality data unavailable</h2>
                <p className="mb-0 mt-2 text-sm leading-relaxed text-slate-500">
                  {airQuality.error || "We could not retrieve an AQI reading for this location. Try refreshing in a moment."}
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                  type="button"
                  onClick={refresh}
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Retry
                </button>
              </div>
            )}

            <p className="mb-0 mt-5 text-center text-[11px] leading-relaxed text-slate-500">
              AQI and health guidance are informational and may not reflect official local alerts.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
