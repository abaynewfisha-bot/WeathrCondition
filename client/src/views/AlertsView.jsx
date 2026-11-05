import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Activity,
  ArrowDown,
  CheckCircle2,
  Clock3,
  HeartPulse,
  History,
  Leaf,
  RefreshCw,
  Search,
  ShieldCheck,
  Wind
} from "lucide-react";
import useWeather from "../controllers/useWeather";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

const AIR_QUALITY_HISTORY_KEY = "weatherworld_air_quality_alert_history";
const AIR_QUALITY_HISTORY_EVENT = "weatherworld:air-quality-history";
const AQI_MAX = 500;
const AQI_CIRCUMFERENCE = 2 * Math.PI * 76;
const AQI_ARC_LENGTH = AQI_CIRCUMFERENCE * 0.78;
let memoryHistorySnapshot = null;

function getHistorySnapshot() {
  if (memoryHistorySnapshot !== null) return memoryHistorySnapshot;
  try {
    return localStorage.getItem(AIR_QUALITY_HISTORY_KEY) || "[]";
  } catch (error) {
    return JSON.stringify({ storageError: error.message || "Unable to read alert history." });
  }
}

function subscribeToHistory(callback) {
  const handleStorage = (event) => {
    if (event.key === AIR_QUALITY_HISTORY_KEY) {
      memoryHistorySnapshot = null;
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(AIR_QUALITY_HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AIR_QUALITY_HISTORY_EVENT, callback);
  };
}

function saveHistory(records) {
  const snapshot = JSON.stringify(records);
  try {
    localStorage.setItem(AIR_QUALITY_HISTORY_KEY, snapshot);
    memoryHistorySnapshot = null;
  } catch (error) {
    memoryHistorySnapshot = JSON.stringify({
      storageError: error.message || "Unable to save alert history.",
      records
    });
  }
  window.dispatchEvent(new Event(AIR_QUALITY_HISTORY_EVENT));
}

function parseHistorySnapshot(snapshot) {
  try {
    const parsed = JSON.parse(snapshot);
    if (parsed && !Array.isArray(parsed) && parsed.storageError) {
      return {
        records: Array.isArray(parsed.records) ? parsed.records : [],
        error: parsed.storageError
      };
    }
    if (!Array.isArray(parsed)) {
      throw new Error("Saved air-quality alert history has an invalid format.");
    }

    const records = parsed.filter((record) =>
      record &&
      typeof record.id === "string" &&
      typeof record.city === "string" &&
      Number.isFinite(record.aqi) &&
      typeof record.category === "string" &&
      typeof record.startedAt === "string" &&
      typeof record.updatedAt === "string" &&
      (record.expiredAt === null || typeof record.expiredAt === "string")
    );
    return {
      records,
      error: records.length === parsed.length
        ? ""
        : "Some invalid saved air-quality records were skipped."
    };
  } catch (error) {
    return {
      records: [],
      error: error.message || "Unable to read saved air-quality history."
    };
  }
}

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

function getHistoryStatus(record) {
  return record.expiredAt ? "Expired" : "Active";
}

export default function AlertsView({ cityName: initialCity = "Nairobi" }) {
  const [cityName, setCityName] = useState(initialCity);
  const [query, setQuery] = useState(initialCity);
  const { weather, loading, error, refresh } = useWeather(cityName);
  const [aqiRefreshKey, setAqiRefreshKey] = useState(0);
  const [airQuality, setAirQuality] = useState({
    requestKey: "",
    value: null,
    pm25: null,
    city: "",
    error: ""
  });
  const historySnapshot = useSyncExternalStore(
    subscribeToHistory,
    getHistorySnapshot,
    () => "[]"
  );
  const { records: alertHistory, error: historyError } = useMemo(
    () => parseHistorySnapshot(historySnapshot),
    [historySnapshot]
  );
  const latitude = weather?.location?.latitude;
  const longitude = weather?.location?.longitude;
  const hasWeather = Boolean(weather);
  const currentCity = weather?.location?.name || cityName;
  const country = weather?.location?.country;
  const latitudeValue = Number(latitude);
  const longitudeValue = Number(longitude);
  const hasValidCoordinates = latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined &&
    Number.isFinite(latitudeValue) &&
    Number.isFinite(longitudeValue);
  const airQualityRequestKey = `${latitude ?? ""}|${longitude ?? ""}|${currentCity}|${aqiRefreshKey}`;
  const airQualityMatchesRequest = airQuality.requestKey === airQualityRequestKey;
  const currentAirQuality = airQualityMatchesRequest ? airQuality : null;
  const airQualityLoading = hasWeather && hasValidCoordinates && !airQualityMatchesRequest;

  useEffect(() => {
    if (!hasWeather || !hasValidCoordinates) return undefined;

    const requestedCity = weather?.location?.name || cityName;
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: String(latitudeValue),
      longitude: String(longitudeValue),
      current: "us_aqi,pm2_5",
      timezone: "auto"
    });

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
          requestKey: airQualityRequestKey,
          value,
          pm25: Number.isFinite(data.current?.pm2_5) ? data.current.pm2_5 : null,
          city: requestedCity,
          error: ""
        });
      })
      .catch((fetchError) => {
        if (fetchError.name !== "AbortError") {
          setAirQuality({
            requestKey: airQualityRequestKey,
            value: null,
            pm25: null,
            city: requestedCity,
            error: fetchError.message || "Unable to load air-quality data."
          });
        }
      });

    return () => controller.abort();
  }, [
    airQualityRequestKey,
    cityName,
    hasValidCoordinates,
    hasWeather,
    latitudeValue,
    longitudeValue,
    weather?.location?.name
  ]);

  useEffect(() => {
    if (
      historyError ||
      loading ||
      error ||
      !hasWeather ||
      airQualityLoading ||
      currentAirQuality?.value === null ||
      currentAirQuality?.value === undefined ||
      currentAirQuality.city.toLowerCase() !== currentCity.toLowerCase() ||
      !currentCity
    ) return;

    const records = [...alertHistory];
    const normalizedCity = currentCity.toLowerCase();
    const now = new Date().toISOString();
    let changed = false;

    if (currentAirQuality.value > 100) {
      const activeRecord = records.find(
        (record) => record.city.toLowerCase() === normalizedCity && !record.expiredAt
      );
      if (activeRecord) {
        const latestAqi = Math.round(currentAirQuality.value);
        if (latestAqi > activeRecord.aqi) {
          activeRecord.aqi = latestAqi;
          activeRecord.category = getAqiCategory(latestAqi).label;
          activeRecord.updatedAt = now;
          changed = true;
        }
      } else {
        records.unshift({
          id: `${Date.now()}-${Math.round(currentAirQuality.value)}`,
          city: currentCity,
          aqi: Math.round(currentAirQuality.value),
          category: getAqiCategory(currentAirQuality.value).label,
          startedAt: now,
          updatedAt: now,
          expiredAt: null
        });
        changed = true;
      }
    } else {
      records.forEach((record) => {
        if (record.city.toLowerCase() === normalizedCity && !record.expiredAt) {
          record.expiredAt = now;
          record.updatedAt = now;
          changed = true;
        }
      });
    }

    if (changed) {
      saveHistory(
        records
          .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
          .slice(0, 100)
      );
    }
  }, [
    alertHistory,
    airQualityLoading,
    currentAirQuality,
    currentCity,
    error,
    hasWeather,
    historyError,
    loading
  ]);

  function searchCity(event) {
    event.preventDefault();
    const nextCity = query.trim();
    if (nextCity) setCityName(nextCity);
  }

  function refreshAirQuality() {
    setAqiRefreshKey((key) => key + 1);
    refresh();
  }

  const aqiValue = currentAirQuality?.value ?? null;
  const airQualityError = hasWeather && !hasValidCoordinates
    ? "Air-quality data is unavailable for this location."
    : currentAirQuality?.error || "";
  const pm25 = currentAirQuality?.pm25 ?? null;
  const category = aqiValue !== null ? getAqiCategory(aqiValue) : null;
  const poorAirQuality = aqiValue !== null && aqiValue > 100;
  const cityHistory = alertHistory
    .filter((record) => record.city.toLowerCase() === currentCity.toLowerCase())
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt));
  const activeHistoryCount = cityHistory.filter((record) => !record.expiredAt).length;
  const progress = aqiValue === null
    ? 0
    : Math.min(Math.max(aqiValue / AQI_MAX, 0), 1);
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
    <div className="relative isolate min-w-0 overflow-hidden rounded-[30px] bg-[#080f1d] p-4 text-[#e7edf7] sm:p-7 lg:p-9">
      <div className="pointer-events-none absolute -right-20 top-28 -z-10 h-64 w-64 rounded-full bg-[#ffa52f]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[28%] -z-10 h-64 w-64 rounded-full bg-[#80acd7]/10 blur-3xl" />

      <header className="mx-auto mb-7 flex w-full max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#172438] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#ffa52f]">
            <Activity size={15} aria-hidden="true" />
            LIVE AIR MONITOR
          </span>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-[#e7edf7] sm:text-4xl">
            Air quality
          </h1>
          <p className="mb-0 mt-2 max-w-xl text-sm leading-relaxed text-[#91a5bf]">
            Check the AQI, see whether air quality is poor, and get practical health recommendations.
          </p>
        </div>

        <form className="flex w-full gap-2 sm:w-auto" onSubmit={searchCity}>
          <label className="min-w-0 flex-1 sm:w-56">
            <span className="sr-only">City for air quality</span>
            <input
              className="h-11 w-full rounded-2xl border border-[#293a52] bg-[#172438] px-4 text-sm text-[#e7edf7] outline-none placeholder:text-[#91a5bf] focus:border-[#ffa52f] focus:ring-2 focus:ring-[#ffa52f]/30"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a city"
            />
          </label>
          <button
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#ffa52f] px-4 text-sm font-semibold text-[#151b26] transition hover:brightness-105"
            type="submit"
            aria-label="Check air quality"
          >
            <Search size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#293a52] bg-[#172438] text-[#ffa52f] transition hover:border-[#ffa52f] disabled:opacity-60"
            type="button"
            onClick={refreshAirQuality}
            disabled={loading}
            aria-label="Refresh air quality"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={17} aria-hidden="true" />
          </button>
        </form>
      </header>

      <section className="mx-auto max-w-6xl" aria-label="Air quality for selected city">
        {loading && <Loader message={`Finding air quality for ${cityName}...`} />}
        <ErrorMessage message={error} onRetry={refreshAirQuality} />

        {!loading && !error && (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#293a52] bg-[#111d30] px-5 py-4">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffa52f]">
                  Monitoring location
                </span>
                <h2 className="mb-0 mt-1 text-lg font-bold text-[#e7edf7]">
                  {currentCity}{country ? `, ${country}` : ""}
                </h2>
              </div>
              <span className="rounded-full bg-[#172438] px-3 py-1.5 text-xs font-medium text-[#91a5bf]">
                Current US AQI
              </span>
            </div>

            {airQualityLoading ? (
              <div className="rounded-[28px] border border-[#293a52] bg-[#111d30] p-6">
                <Loader message={`Checking air quality for ${currentCity}...`} />
              </div>
            ) : category ? (
              <>
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <article className="relative overflow-hidden rounded-[28px] border border-[#293a52] bg-[#111d30] p-5 sm:p-7">
                    <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#ffa52f]/10 blur-2xl" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffa52f]">
                          <Leaf size={17} aria-hidden="true" />
                          Air quality index
                        </span>
                        <p className="mb-0 mt-2 text-xs text-[#91a5bf]">US AQI · Updated now</p>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        poorAirQuality
                          ? "bg-rose-100 text-rose-600"
                          : aqiValue <= 50
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}>
                        {poorAirQuality ? "Poor air quality" : `${category.label} air quality`}
                      </span>
                    </div>

                    <div className="relative mt-8 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <div>
                        <p className="mb-1 text-sm font-medium text-[#91a5bf]">Current AQI level</p>
                        <div className="flex items-baseline gap-2">
                          <strong className="text-6xl font-bold tracking-tight text-[#e7edf7] sm:text-7xl">
                            {Math.round(aqiValue)}
                          </strong>
                          <span className="text-sm font-semibold text-[#91a5bf]">/ {AQI_MAX}</span>
                        </div>
                        <p className="mb-0 mt-2 text-lg font-semibold" style={{ color: category.color }}>
                          {category.label}
                        </p>
                        <p className="mb-0 mt-2 max-w-sm text-sm leading-relaxed text-[#91a5bf]">
                          {category.summary}
                        </p>
                      </div>

                      <div className="relative mx-auto grid h-48 w-48 place-items-center sm:h-52 sm:w-52">
                        <svg
                          className="absolute inset-0 h-full w-full -rotate-[130deg]"
                          viewBox="0 0 180 180"
                          role="img"
                          aria-label={`AQI ${Math.round(aqiValue)} out of ${AQI_MAX}`}
                        >
                          <circle
                            cx="90"
                            cy="90"
                            r="76"
                            fill="none"
                            stroke="#293a52"
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
                          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#ffa52f]">
                            AQI
                          </span>
                          <strong className="block text-4xl font-bold text-[#e7edf7]">
                            {Math.round(aqiValue)}
                          </strong>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#91a5bf]">
                            0 <ArrowDown size={11} className="rotate-[-90deg]" aria-hidden="true" /> 500
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#293a52] pt-4 text-xs text-[#91a5bf]">
                      <span className="font-semibold text-[#e7edf7]">{getAqiLevel(aqiValue)} air</span>
                      {pm25 !== null && (
                        <span>PM2.5: {pm25.toFixed(1)} µg/m³</span>
                      )}
                    </div>
                  </article>

                  <aside className="rounded-[28px] bg-gradient-to-br from-[#294260] via-[#172b45] to-[#111d30] p-5 text-[#e7edf7] sm:p-7">
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

                <section className="mt-5 rounded-[26px] border border-[#293a52] bg-[#111d30] p-5 sm:p-6" aria-labelledby="aqi-scale-heading">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffa52f]">AQI guide</span>
                      <h2 className="mb-0 mt-1 text-lg font-bold text-[#e7edf7]" id="aqi-scale-heading">Understand the levels</h2>
                    </div>
                    <p className="mb-0 text-xs text-[#91a5bf]">Current level: {getAqiLevel(aqiValue)}</p>
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
                          getAqiLevel(aqiValue) === label
                            ? "border-[#ffa52f] bg-[#3b2c16] shadow-sm"
                            : "border-[#293a52] bg-[#172438]"
                        }`}
                        key={label}
                      >
                        <span className="mb-2 block h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="block text-[10px] font-semibold text-[#91a5bf]">{range}</span>
                        <span className="mt-1 block text-xs font-bold leading-tight text-[#e7edf7]">{label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="rounded-[26px] border border-[#293a52] bg-[#111d30] p-6" role="status">
                <h2 className="m-0 text-lg font-bold text-[#e7edf7]">Air-quality data unavailable</h2>
                <p className="mb-0 mt-2 text-sm leading-relaxed text-[#91a5bf]">
                  {airQualityError || "We could not retrieve an AQI reading for this location. Try refreshing in a moment."}
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#ffa52f] px-4 py-2.5 text-sm font-semibold text-[#151b26] hover:brightness-105"
                  type="button"
                  onClick={refreshAirQuality}
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Retry
                </button>
              </div>
            )}
          </>
        )}

        <section className="mt-5 rounded-[26px] border border-[#293a52] bg-[#111d30] p-5 text-[#e7edf7] sm:p-6" aria-labelledby="alert-history-heading">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#172438] text-[#ffa52f]">
                    <History size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                      Air quality
                    </span>
                    <h2 className="mb-0 mt-1 text-lg font-bold" id="alert-history-heading">
                      Previous alerts
                    </h2>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70">
                  {activeHistoryCount} active · {cityHistory.length - activeHistoryCount} expired
                </span>
              </div>

              {historyError && (
                <p className="mb-4 rounded-xl border border-rose-300/20 bg-rose-400/10 p-3 text-xs text-rose-200" role="alert">
                  {historyError}
                </p>
              )}

              {cityHistory.length ? (
                <div className="grid gap-3">
                  {cityHistory.map((record) => {
                    const active = !record.expiredAt;
                    return (
                      <article
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#293a52] bg-[#172438] p-4 sm:flex-row sm:items-center"
                        key={record.id}
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                            active ? "bg-rose-400/15 text-rose-300" : "bg-emerald-400/15 text-emerald-300"
                          }`}>
                            {active
                              ? <Activity size={17} aria-hidden="true" />
                              : <CheckCircle2 size={17} aria-hidden="true" />}
                          </span>
                          <div className="min-w-0">
                            <h3 className="m-0 text-sm font-semibold text-white">
                              {record.category} air quality
                            </h3>
                            <p className="mb-0 mt-1 text-xs text-white/60">
                              {record.city} · AQI {record.aqi}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/50">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock3 size={12} aria-hidden="true" />
                                Started {new Date(record.startedAt).toLocaleString()}
                              </span>
                              {record.expiredAt && (
                                <span>
                                  Expired {new Date(record.expiredAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                          active
                            ? "bg-rose-400/15 text-rose-300"
                            : "bg-emerald-400/15 text-emerald-300"
                        }`}>
                          {getHistoryStatus(record)}
                        </span>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#293a52] bg-[#172438] p-5 text-center">
                  <p className="m-0 text-sm font-medium text-white/80">No previous air-quality alerts for {currentCity}.</p>
                  <p className="mb-0 mt-1 text-xs text-white/50">
                    Poor-air readings will appear here with their date, time, and status.
                  </p>
                </div>
              )}
              <p className="mb-0 mt-4 text-[11px] leading-relaxed text-white/40">
                History is saved in this browser. Alerts are marked expired when a later AQI check is no longer poor.
              </p>
        </section>

        <p className="mb-0 mt-5 text-center text-[11px] leading-relaxed text-[#91a5bf]">
          AQI and health guidance are informational and may not reflect official local alerts.
        </p>
      </section>
    </div>
  );
}
