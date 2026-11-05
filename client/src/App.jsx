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
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar
        onSelectCity={selectCity}
        onLocate={requestLocation}
      />

      <div className="grid min-h-[calc(100vh-82px)] grid-cols-1 min-[681px]:grid-cols-[175px_minmax(0,1fr)] min-[1051px]:grid-cols-[215px_minmax(0,1fr)]">
        <Sidebar />

        <main className="mx-auto w-full min-w-0 max-w-[1700px] p-[14px] min-[681px]:p-6">
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
  );
}

export default function App() {
  return <AppLayout />;
}
