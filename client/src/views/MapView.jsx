import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorldMap from "../components/map/WorldMap";
import CitySearchBar from "../components/search/CitySearchBar";

export default function MapView() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);

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

  return (
    <>
      <h1 className="mb-[18px] text-2xl font-bold">World weather map</h1>

      <section className="min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
        <p className="text-[var(--muted)]">
          Search for a city to focus the map, or select a marker to view its forecast.
        </p>

        <CitySearchBar onSelect={openCity} />

        <div className="h-[min(65vh,650px)] min-h-[360px] overflow-hidden rounded-[14px]">
          <WorldMap
            className="!h-full"
            onSelectCity={(city) => navigate(`/city/${encodeURIComponent(city)}`)}
            coordinates={selectedCity}
            selectedCity={selectedCity}
          />
        </div>

        {selectedCity && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[var(--muted)]">Selected city</div>
              <strong>
                {selectedCity.name}
                {selectedCity.country ? `, ${selectedCity.country}` : ""}
              </strong>
            </div>

            <button
              className="rounded-[10px] bg-[var(--accent)] px-4 py-2.5 font-semibold text-[#151b26] hover:brightness-105"
              onClick={() => navigate(`/city/${encodeURIComponent(selectedCity.name)}`)}
            >
              View forecast
            </button>
          </div>
        )}
      </section>
    </>
  );
}
