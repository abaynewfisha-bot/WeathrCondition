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
    <div className="relative min-w-[100px] flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={19} />
      <input
        className="w-full rounded-[15px] border border-transparent bg-[var(--card)] py-[15px] pl-[46px] pr-[18px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
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
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[1000] max-h-80 overflow-y-auto rounded-[14px] border border-[var(--border)] bg-[var(--panel)] shadow-[0_15px_40px_#0005]">
          {loading && <div className="flex w-full flex-col gap-1 bg-transparent px-4 py-3 text-left">Searching...</div>}

          {error && <div className="flex w-full flex-col gap-1 bg-transparent px-4 py-3 text-left">{error}</div>}

          {results.map((city, index) => (
            <button
              className="flex w-full flex-col gap-1 bg-transparent px-4 py-3 text-left text-[var(--text)] hover:bg-[var(--card)]"
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => chooseCity(city)}
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {city.name}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {[city.admin1, city.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}

          {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
            <div className="flex w-full flex-col gap-1 bg-transparent px-4 py-3 text-left">No cities found.</div>
          )}
        </div>
      )}
    </div>
  );
}
