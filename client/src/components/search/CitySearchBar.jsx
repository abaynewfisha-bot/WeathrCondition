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
    <div className="relative">
      <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#91a5bf]" size={19} />
      <input
        className="min-h-[42px] w-full rounded-xl border border-[#293a52] bg-[#172438] py-[10px] pl-[42px] pr-[14px] text-[#e7edf7] outline-none placeholder:text-[#91a5bf] focus:border-[#ffa52f]"
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
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] overflow-hidden rounded-xl border border-[#293a52] bg-[#111d30] shadow-xl">
          {loading && <div className="px-[14px] py-[11px] text-[#e7edf7]">Searching...</div>}

          {error && <div className="px-[14px] py-[11px] text-[#e7edf7]">{error}</div>}

          {results.map((city, index) => (
            <button
              className="flex w-full items-center justify-between border-0 bg-transparent px-[14px] py-[11px] text-left text-[#e7edf7] hover:bg-[#172438]"
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => chooseCity(city)}
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {city.name}
              </span>
              <span className="text-xs text-[#91a5bf]">
                {[city.admin1, city.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}

          {!loading && !error && results.length === 0 && query.trim().length >= 2 && (
            <div className="px-[14px] py-[11px] text-[#e7edf7]">No cities found.</div>
          )}
        </div>
      )}
    </div>
  );
}
