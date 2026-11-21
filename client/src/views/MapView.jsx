import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloudSun, Compass, Droplets, MapPin, Wind } from "lucide-react";
import WorldMap from "../components/map/WorldMap";
import CitySearchBar from "../components/search/CitySearchBar";
import { getWeatherByCoordinates } from "../services/weatherService";
import { useUnit } from "../context/UnitContext";
import { formatTemperature } from "../utils/convertTemp";
import { getWeatherDescription } from "../utils/weatherCodes";
import { useLanguage } from "../context/LanguageContext";

export default function MapView() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [mapWeatherLoading, setMapWeatherLoading] = useState(false);
  const [mapWeatherError, setMapWeatherError] = useState("");
  const { unit } = useUnit();
  const { t } = useLanguage();

  useEffect(() => {
    if (!selectedCity) return undefined;

    let active = true;
    setMapWeatherLoading(true);
    setMapWeatherError("");

    getWeatherByCoordinates(selectedCity.latitude, selectedCity.longitude)
      .then((result) => {
        if (!active) return;
        setWeather(result);
        setSelectedCity((current) => ({
          ...current,
          name: result.location?.name || current.name,
          country: result.location?.country || current.country,
          timezone: result.location?.timezone || current.timezone
        }));
      })
      .catch((err) => {
        if (!active) return;
        setWeather(null);
        setMapWeatherError(
          err.response?.data?.error || "Unable to load weather for this map location."
        );
      })
      .finally(() => {
        if (active) setMapWeatherLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCity?.latitude, selectedCity?.longitude]);

  const openCity = (cityName, city) => {
    const latitude = Number(city?.latitude);
    const longitude = Number(city?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    setSelectedCity({
      ...city,
      name: cityName,
      latitude,
      longitude
    });
  };

  const selectMapPoint = ({ latitude, longitude }) => {
    setSelectedCity({
      name: "Selected map location",
      country: "",
      admin1: "",
      timezone: "Auto",
      latitude,
      longitude
    });
  };

  return (
    <section className="min-w-0">
      <div className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("map")}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("mapDescription")}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[#ffa52f]" />
          Weather locations
        </div>
      </div>

      <div className="mb-4">
        <CitySearchBar onSelect={openCity} />
      </div>

      <div className="grid gap-4 min-[1051px]:grid-cols-[minmax(0,2fr)_320px]">
        <div className="h-[min(65vh,620px)] min-h-[420px] overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-2 shadow-[0_12px_30px_rgba(15,30,70,.10)]">
          <WorldMap
            className="!h-full !rounded-[14px]"
            onSelectCity={(cityName, city) => openCity(cityName, city)}
            onMapClick={selectMapPoint}
            coordinates={selectedCity}
            selectedCity={selectedCity}
          />
        </div>

        <aside className="grid content-start gap-4">
          {selectedCity ? (
            <>
              <div className="rounded-[20px] bg-[linear-gradient(135deg,#1d62c8,#4d82df,#8c72c8)] p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-white/70">
                      {t("selectedLocation")}
                    </p>
                    <h2 className="mt-2 flex items-center gap-2 text-xl font-bold">
                      <MapPin size={19} fill="white" />
                      {selectedCity.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/75">
                      {selectedCity.admin1 ? `${selectedCity.admin1}, ` : ""}
                      {selectedCity.country || "Unknown country"}
                    </p>
                  </div>
                  <CloudSun size={38} className="text-[#ffd45a]" />
                </div>

                {weather?.current ? (
                  <div className="mt-5">
                    <div className="text-[44px] font-extrabold leading-none">
                      {formatTemperature(weather.current.temperature_2m, unit)}
                      {unit}
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {getWeatherDescription(weather.current.weather_code)}
                    </p>
                  </div>
                ) : mapWeatherLoading ? (
                  <p className="mt-5 text-sm text-white/75">Loading weather conditions...</p>
                ) : mapWeatherError ? (
                  <p className="mt-5 text-sm text-[#ffd3dc]">{mapWeatherError}</p>
                ) : (
                  <p className="mt-5 text-sm text-white/75">Loading weather conditions...</p>
                )}
              </div>

              <div className="rounded-[18px] border border-[var(--border)] bg-[var(--panel)] p-5">
                <h2 className="mb-4 flex items-center gap-2 font-bold">
                  <Compass size={19} className="text-[#75a8ee]" />
                  {t("geographicalInfo")}
                </h2>
                <dl className="grid grid-cols-[90px_1fr] gap-3 text-sm">
                  <dt className="text-[var(--muted)]">{t("latitude")}</dt>
                  <dd className="font-semibold">{selectedCity.latitude.toFixed(4)}°</dd>
                  <dt className="text-[var(--muted)]">{t("longitude")}</dt>
                  <dd className="font-semibold">{selectedCity.longitude.toFixed(4)}°</dd>
                  <dt className="text-[var(--muted)]">{t("timezone")}</dt>
                  <dd className="font-semibold">{selectedCity.timezone || "Auto"}</dd>
                </dl>
              </div>

              {weather?.current && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] border border-[var(--border)] bg-[var(--panel)] p-4">
                    <Droplets size={18} className="text-[#64aeea]" />
                    <strong className="mt-2 block">{weather.current.relative_humidity_2m}%</strong>
                    <span className="text-xs text-[var(--muted)]">Humidity</span>
                  </div>
                  <div className="rounded-[14px] border border-[var(--border)] bg-[var(--panel)] p-4">
                    <Wind size={18} className="text-[#63c0ba]" />
                    <strong className="mt-2 block">{Math.round(weather.current.wind_speed_10m)} km/h</strong>
                    <span className="text-xs text-[var(--muted)]">Wind</span>
                  </div>
                </div>
              )}

              <button
                className="min-h-[44px] rounded-[12px] bg-[linear-gradient(135deg,#ec9a45,#d46f91)] px-4 font-bold text-white"
                onClick={() =>
                  navigate(
                    `/city/${encodeURIComponent(selectedCity.name)}?lat=${selectedCity.latitude}&lng=${selectedCity.longitude}`
                  )
                }
              >
                {t("viewForecast")}
              </button>
            </>
          ) : (
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-6 text-center">
              <MapPin size={38} className="mx-auto text-[#71a5e9]" />
              <h2 className="mt-3 font-bold">Select a location</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Search for a city or select a map marker to view geographic and weather details.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
