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
    <div className="app-shell">
      <Navbar
        onSelectCity={selectCity}
        onLocate={requestLocation}
      />

      <div className="layout">
        <Sidebar />

        <main className="main-content">
          {locationError && (
            <div className="panel" style={{ marginBottom: 16 }}>
              <p className="muted">{locationError}</p>
            </div>
          )}

          {coordinates && (
            <div className="panel" style={{ marginBottom: 16 }}>
              <p>
                Your coordinates: {coordinates.latitude.toFixed(4)},{" "}
                {coordinates.longitude.toFixed(4)}
              </p>
              <p className="muted">
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
              element={<AlertsView />}
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
