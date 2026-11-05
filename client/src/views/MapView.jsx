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
      <h1 className="page-heading">World weather map</h1>

      <section className="panel">
        <p className="muted">
          Search for a city to focus the map, or select a marker to view its forecast.
        </p>

        <CitySearchBar onSelect={openCity} />

        <div className="map-view-container">
          <WorldMap
            onSelectCity={(city) => navigate(`/city/${encodeURIComponent(city)}`)}
            coordinates={selectedCity}
            selectedCity={selectedCity}
          />
        </div>

        {selectedCity && (
          <div className="card-row" style={{ marginTop: 16 }}>
            <div>
              <div className="muted">Selected city</div>
              <strong>
                {selectedCity.name}
                {selectedCity.country ? `, ${selectedCity.country}` : ""}
              </strong>
            </div>

            <button
              className="primary-button"
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
