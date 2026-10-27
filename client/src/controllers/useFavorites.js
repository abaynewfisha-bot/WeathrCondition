import { useCallback, useEffect, useState } from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite
} from "../services/favoriteService";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem("weatherworld_token"))
  );
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("weatherworld_token");

    if (!token) return;

    setLoading(true);
    setError("");

    try {
      setFavorites(await getFavorites());
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to load favorites."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("weatherworld_token")) return undefined;

    let active = true;
    getFavorites()
      .then((savedFavorites) => {
        if (active) setFavorites(savedFavorites);
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.error || "Unable to load favorites.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const add = async (cityName, country = "") => {
    const favorite = await addFavorite(cityName, country);
    await refresh();
    return favorite;
  };

  const remove = async (id) => {
    await removeFavorite(id);
    await refresh();
  };

  return { favorites, loading, error, refresh, add, remove };
}
