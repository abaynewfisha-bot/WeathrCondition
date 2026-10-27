import { useState } from "react";
// import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldMap from "../components/map/WorldMap";

export default function MapView() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Nairobi");

  const openCity = (city) => {
    setSelectedCity(city);
  };

  return (
    <>
      <h1 className="page-heading">World weather map</h1>

      <section className="panel">
        <p className="muted">
          Select a marker on the map to choose a city.
        </p>

        <div className="map-view-container">
          <WorldMap onSelectCity={openCity} />
        </div>

        <div className="card-row" style={{ marginTop: 16 }}>
          <div>
            <div className="muted">Selected city</div>
            <strong>{selectedCity}</strong>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate(`/city/${encodeURIComponent(selectedCity)}`)}
          >
            View forecast
          </button>
        </div>
      </section>
    </>
  );
}
