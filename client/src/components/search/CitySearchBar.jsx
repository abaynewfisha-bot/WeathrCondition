import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { searchWeatherCities } from "../../services/weatherService";

export default function CitySearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState({
    query: "",
    results: [],
    loading: false,
    error: ""
  });
  const currentSearch = searchState.query === query.trim()
    ? searchState
    : { results: [], loading: false, error: "" };
  const { results, loading, error } = currentSearch;

  useEffect(() => {
    const searchQuery = query.trim();
    if (searchQuery.length < 2) return undefined;

    let active = true;

    const timer = setTimeout(async () => {
      setSearchState({
        query: searchQuery,
        results: [],
        loading: true,
        error: ""
      });

      try {
        const cities = await searchWeatherCities(searchQuery);

        if (active) {
          setSearchState({
            query: searchQuery,
            results: cities,
            loading: false,
            error: ""
          });
        }
      } catch {
        if (active) {
          setSearchState({
            query: searchQuery,
            results: [],
            loading: false,
            error: "Could not search cities. Check your backend connection."
          });
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const chooseCity = (city) => {
    const label = city.country
      ? `${city.name}, ${city.country}`
      : city.name;

    setQuery(label);
    setSearchState({
      query: "",
      results: [],
      loading: false,
      error: ""
    });
    onSelect?.(city.name, city);
  };

  return (
    <div className="search-wrap">
      <Search className="search-icon" size={19} />
      <input
        className="search-input"
        placeholder="Search any city"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setSearchState({
              query: "",
              results: [],
              loading: false,
              error: ""
            });
          }
          if (event.key === "Enter" && results.length) chooseCity(results[0]);
        }}
        aria-label="Search any city"
        autoComplete="off"
      />

      {(loading || results.length > 0 || error) && (
        <div className="search-results">
          {loading && <div className="search-result">Searching...</div>}

          {error && <div className="search-result">{error}</div>}

          {results.map((city, index) => (
            <button
              className="search-result"
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => chooseCity(city)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={16} />
                {city.name}
              </span>
              <span className="result-secondary">
                {[city.admin1, city.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}

          {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
            <div className="search-result">No cities found.</div>
          )}
        </div>
      )}
    </div>
  );
}
