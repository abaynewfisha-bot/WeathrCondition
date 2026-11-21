import { useState } from "react";

export default function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setError("");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      () => {
        setError("Location permission denied or unavailable.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  return { coordinates, error, loading, locate };
}
