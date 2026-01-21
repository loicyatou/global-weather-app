import { HeroPanel } from "@/components/ui/HeroPanel";
import { SidePanel } from "@/components/ui/SidePanel";
import { weatherBackgroundMap } from "@/components/utils/backgrounds";
import { mapConditionToBackgroundKey } from "@/components/mappers/mapConditionToBackground";
import type { WeatherData } from "@/components/types/weatherDomain";

type WeatherShellProps = {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  locations: string[];
  handleSetInput: (newInput: string) => void;
  searchCity: (cityRaw: string) => Promise<void> | void;
};

export function WeatherShell({
  weatherData,
  isLoading,
  error,
  locations,
  handleSetInput,
  searchCity,
}: WeatherShellProps) {
  const backgroundKey = mapConditionToBackgroundKey(weatherData?.condition);
  const bgImage = weatherBackgroundMap[backgroundKey];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        {weatherData ? (
          <HeroPanel weatherData={weatherData} />
        ) : (
          <div className="p-10 text-white">
            {isLoading ? "Loading..." : error ? error : "Loading..."}
          </div>
        )}

        <SidePanel
          setInput={handleSetInput}
          onSearchCity={searchCity}
          weatherData={weatherData}
          isLoading={isLoading}
          error={error}
          locations={locations}
        />
      </div>
    </div>
  );
}
