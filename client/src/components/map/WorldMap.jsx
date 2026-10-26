import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap
} from "react-leaflet";
import { searchCities } from "../../services/cityService";

const fallbackCities = [
  { name: "Nairobi", country: "Kenya", latitude: -1.2864, longitude: 36.8172 },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { name: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { name: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708 },
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 }
];

function MapFocus({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.flyTo(
        [coordinates.latitude, coordinates.longitude],
        6,
        { duration: 1 }
      );
    }
  }, [coordinates, map]);

  return null;
}

export default function WorldMap({ onSelectCity, coordinates }) {
  const [cities, setCities] = useState(fallbackCities);

  useEffect(() => {
    let active = true;

    searchCities("a")
      .then((results) => {
        if (active && results.length) setCities(results);
      })
      .catch(() => {
        // The built-in fallback locations keep the map usable.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        scrollWheelZoom
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapFocus coordinates={coordinates} />

        {cities.map((city, index) => (
          <CircleMarker
            key={`${city.name}-${city.country}-${index}`}
            center={[Number(city.latitude), Number(city.longitude)]}
            radius={6}
            pathOptions={{
              color: "#ffa52f",
              fillColor: "#ffa52f",
              fillOpacity: 0.9
            }}
            eventHandlers={{
              click: () => onSelectCity?.(city.name)
            }}
          >
            <Popup>
              <strong>{city.name}</strong>
              <div>{city.country}</div>
              <button onClick={() => onSelectCity?.(city.name)}>
                View weather
              </button>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
