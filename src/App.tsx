import { useMemo } from "react";
import { WeatherService } from "@/components/services/weatherService";
import { WeatherShell } from "@/components/ui/WeatherShell";
import { useWeatherController } from "@/components/hooks/useWeatherHook";

export default function App() {
  const weatherService = useMemo(() => new WeatherService(), []);
  const {
    weatherData,
    isLoading,
    error,
    recentLocations,
    handleSetInput,
    searchCity,
  } = useWeatherController(weatherService, "London");

  return (
    <WeatherShell
      weatherData={weatherData}
      isLoading={isLoading}
      error={error}
      locations={recentLocations}
      handleSetInput={handleSetInput}
      searchCity={searchCity}
    />
  );
}
