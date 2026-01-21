import type { WeatherData } from "../types/weatherDomain";
import LocationSearch from "./LocationSearch";
import { StoredLocations } from "./StoredLocations";
import { WeatherDetails } from "./WeatherDetails";

type SearchMode = "UK" | "GLOBAL";

export type SidePanelProps = {
  setInput: (input: string) => void;
  onSearchCity: (city: string) => void;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  locations: string[];
  searchMode: "UK" | "GLOBAL";
  setSearchMode: React.Dispatch<React.SetStateAction<SearchMode>>;
};

export function SidePanel({
  setInput,
  onSearchCity,
  weatherData,
  isLoading,
  error,
  locations,
  searchMode,
  setSearchMode,
}: SidePanelProps) {
  return (
    <aside className="h-full p-8 bg-black/40 text-white">
      <div className="flex items-stretch gap-3">
        {/* Search input */}
        <div className="flex-1 h-10">
          <LocationSearch onSearch={onSearchCity} />
        </div>

        {/* Dropdown */}
        <div className="relative h-10 flex items-center">
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as "UK" | "GLOBAL")}
            className="
              h-full
              appearance-none
              bg-transparent
              text-white/80
              text-xs
              px-2
              pr-7
              rounded-md
              outline-none
              border border-transparent
              hover:bg-white/5 hover:text-white
              focus:bg-white/5 focus:text-white
              focus:border-white/20
              transition
              cursor-pointer
            "
            aria-label="Search region"
          >
            <option value="UK">UK only</option>
            <option value="GLOBAL">Global</option>
          </select>

          {/* custom caret */}
          <span className="pointer-events-none absolute right-2 text-white/60 text-xs">
            ▾
          </span>
        </div>
      </div>

      <div className="mt-2 text-xs opacity-70 min-h-[16px]">
        {isLoading ? "Loading weather…" : error ? error : ""}
      </div>

      <StoredLocations
        locations={locations}
        onSelect={(city) => {
          setInput(city);
          onSearchCity(city);
        }}
      />

      <div className="border-t border-white/20 my-8" />

      <WeatherDetails weatherData={weatherData} />
    </aside>
  );
}
