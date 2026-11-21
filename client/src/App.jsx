import { useState } from "react";
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

import useGeolocation from "./controllers/useGeolocation";

function AppLayout() {
  const navigate = useNavigate();
  const { coordinates, error: locationError, locate } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState("Nairobi");

  function selectCity(city) {
    setSelectedCity(city);
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
          />

          <main className="mx-auto w-full min-w-0 max-w-[1700px] p-[14px] min-[681px]:p-5">
          {locationError && (
            <div className="mb-4 min-w-0 rounded-[20px] bg-[var(--panel)] p-4 sm:p-5">
              <p className="text-[var(--muted)]">{locationError}</p>
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
              path="/map"
              element={<MapView />}
            />

            <Route
              path="/favorites"
              element={<FavoritesView />}
            />

            <Route
              path="/settings"
              element={
                <div className="min-h-[420px] rounded-[20px] bg-[var(--panel)] p-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <p className="mt-3 text-[var(--muted)]">Use the top controls to change units and appearance.</p>
                </div>
              }
            />

            <Route
              path="/about"
              element={
                <div className="min-h-[420px] rounded-[20px] bg-[var(--panel)] p-6">
                  <h1 className="text-2xl font-bold">About WeatherWorld</h1>
                  <p className="mt-3 text-[var(--muted)]">Current conditions and forecasts for cities around the world.</p>
                </div>
              }
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
