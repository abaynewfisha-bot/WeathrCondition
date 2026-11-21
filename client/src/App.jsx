import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import DashboardView from "./views/DashboardView";
import CityDetailView from "./views/CityDetailView";
import MapView from "./views/MapView";
import FavoritesView from "./views/FavoritesView";
import AlertsView from "./views/AlertsView";
import NotFoundView from "./views/NotFoundView";
import SettingsView from "./views/SettingsView";
import AboutView from "./views/AboutView";
import CitiesView from "./views/CitiesView";

import useGeolocation from "./controllers/useGeolocation";
import { getWeatherByCoordinates } from "./services/weatherService";

function AppLayout() {
  const navigate = useNavigate();
  const { coordinates, error: locationError, loading: geolocationLoading, locate } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState("Nairobi");
  const [selectedCountry, setSelectedCountry] = useState("Kenya");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationResolveError, setLocationResolveError] = useState("");

  useEffect(() => {
    if (!coordinates) return;

    let active = true;
    setLocationLoading(true);
    setLocationResolveError("");

    getWeatherByCoordinates(coordinates.latitude, coordinates.longitude)
      .then((weather) => {
        if (!active) return;
        setSelectedCity(weather.location.name);
        setSelectedCountry(weather.location.country);
      })
      .catch((err) => {
        if (!active) return;
        setLocationResolveError(
          err.response?.data?.error || "Unable to resolve your current location."
        );
      })
      .finally(() => {
        if (active) setLocationLoading(false);
      });

    return () => {
      active = false;
    };
  }, [coordinates]);

  function selectCity(city, cityInfo) {
    setSelectedCity(city);
    if (cityInfo?.country) {
      setSelectedCountry(cityInfo.country);
    }
    navigate(`/city/${encodeURIComponent(city)}`);
  }

  function requestLocation() {
    locate();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="grid min-h-screen grid-cols-1 min-[681px]:grid-cols-[205px_minmax(0,1fr)]">
        <Sidebar />

        <div className="min-w-0">
          <Navbar
            onSelectCity={selectCity}
            onLocate={requestLocation}
            cityName={selectedCity}
            countryName={selectedCountry}
            locationLoading={geolocationLoading || locationLoading}
          />

          <main className="mx-auto w-full min-w-0 max-w-[1700px] p-[14px] min-[681px]:p-5">
          {locationError && (
            <div className="mb-4 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
              <p className="text-[var(--muted)]">{locationError}</p>
            </div>
          )}

          {locationResolveError && (
            <div className="mb-4 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
              <p className="text-[var(--muted)]">{locationResolveError}</p>
            </div>
          )}

          {coordinates && (
            <div className="mb-4 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
              <p>
                Your coordinates: {coordinates.latitude.toFixed(4)},{" "}
                {coordinates.longitude.toFixed(4)}
              </p>
              <p className="text-[var(--muted)]">
                To show weather for your exact coordinates, add a dedicated
                coordinates endpoint to the backend.
              </p>
            </div>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <DashboardView
                  cityName={selectedCity}
                  onSelectCity={selectCity}
                />
              }
            />

            <Route
              path="/city/:city"
              element={<CityDetailView />}
            />

            <Route
              path="/cities"
              element={<CitiesView />}
            />

            <Route
              path="/map"
              element={<MapView />}
            />

            <Route
              path="/favorites"
              element={<FavoritesView />}
            />

            <Route
              path="/settings"
              element={<SettingsView />}
            />

            <Route
              path="/about"
              element={<AboutView />}
            />

            <Route
              path="/alerts"
              element={<AlertsView cityName={selectedCity} />}
            />

            <Route
              path="/home"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="*"
              element={<NotFoundView />}
            />
          </Routes>

          <Footer />
        </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
