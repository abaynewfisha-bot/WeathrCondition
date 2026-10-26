import { useCallback, useState } from "react";
import { searchCities } from "../services/cityService";

export default function useCities() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cities = await searchCities(query.trim());
      setResults(cities);
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to search for cities."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search, setResults };
}
