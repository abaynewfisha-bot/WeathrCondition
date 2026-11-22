import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherworld_user") || "null");
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem("weatherworld_token")));

  useEffect(() => {
    const token = localStorage.getItem("weatherworld_token");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    let active = true;
    api
      .get("/auth/me")
      .then((response) => {
        if (!active) return;
        const nextUser = response.data.user;
        setUser(nextUser);
        localStorage.setItem("weatherworld_user", JSON.stringify(nextUser));
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        localStorage.removeItem("weatherworld_token");
        localStorage.removeItem("weatherworld_user");
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function setAuthenticated(response) {
    setUser(response.user);
    localStorage.setItem("weatherworld_token", response.token);
    localStorage.setItem("weatherworld_user", JSON.stringify(response.user));
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Local logout remains valid if the API is unavailable.
    }
    setUser(null);
    localStorage.removeItem("weatherworld_token");
    localStorage.removeItem("weatherworld_user");
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
