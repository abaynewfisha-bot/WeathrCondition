import { CircleMarker, Popup } from "react-leaflet";

export default function CityMarker({ city, onSelect }) {
  if (
    !Number.isFinite(Number(city.latitude)) ||
    !Number.isFinite(Number(city.longitude))
  ) {
    return null;
  }

  return (
    <CircleMarker
      center={[Number(city.latitude), Number(city.longitude)]}
      radius={7}
      pathOptions={{
        color: "#ffa52f",
        fillColor: "#ffa52f",
        fillOpacity: 0.9,
        weight: 2
      }}
      eventHandlers={{
        click: () => onSelect?.(city.name)
      }}
    >
      <Popup>
        <strong>{city.name}</strong>
        {city.country && <div>{city.country}</div>}
        <button
          style={{ marginTop: 6 }}
          onClick={() => onSelect?.(city.name)}
        >
          View weather
        </button>
      </Popup>
    </CircleMarker>
  );
}
