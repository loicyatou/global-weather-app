import type { WeatherData } from "../types/weatherDomain";
import LocationSearch from "./LocationSearch";
import { StoredLocations } from "./StoredLocations";
import { WeatherDetails } from "./WeatherDetails";

export type SidePanelProps = {
  setInput: (input: string) => void;
  onSearchCity: (city: string) => void;

  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;

  locations: string[];
};

export function SidePanel({
  setInput,
  onSearchCity,
  weatherData,
  isLoading,
  error,
  locations,
}: SidePanelProps) {
  return (
    <aside className="h-full p-8 bg-black/40 text-white">
      <LocationSearch
        onSearch={(city) => {
          setInput(city);
          onSearchCity(city);
        }}
      />

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
