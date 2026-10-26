import { useState } from "react";

export default function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        setError("Location permission denied or unavailable.");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return { coordinates, error, locate };
}
