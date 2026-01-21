import { useEffect, useState } from "react";
import type { WeatherData } from "@/components/types/weatherDomain";
import { isValidWeatherData } from "@/components/utils/guards";
import { WeatherService } from "@/components/services/weatherService";
import { ApiClientError } from "../services/openWeatherClient";

type SearchMode = "UK" | "GLOBAL";

type useWeatherHookResult = {
  userInput: string;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  recentLocations: string[];
  handleSetInput: (newInput: string) => void;
  searchCity: (cityRaw: string) => Promise<void>;
  searchMode: SearchMode;
  setSearchMode: React.Dispatch<React.SetStateAction<SearchMode>>;
};

export function useWeatherController(
  weatherService: WeatherService,
  initialCity = "London",
): useWeatherHookResult {
  const [userInput, setUserInput] = useState(initialCity);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>("UK");

  const getCountryCode = (mode: SearchMode) =>
    mode === "UK" ? "GB" : undefined;

  function addRecentLocation(city: string) {
    const normalized = city.trim();
    if (!normalized) return;

    setRecentLocations((prev) =>
      [
        normalized,
        ...prev.filter((c) => c.toLowerCase() !== normalized.toLowerCase()),
      ].slice(0, 4),
    );
  }

  function handleSetInput(newInput: string) {
    setUserInput(newInput);
  }

  async function fetchWeatherData(cityOverride?: string) {
    const city = (cityOverride ?? userInput).trim();
    if (!city) return;

    const countryCode = getCountryCode(searchMode);

    setIsLoading(true);
    setError(null);

    try {
      const data = await weatherService.getCurrentWeather(city, countryCode);

      if (!isValidWeatherData(data)) {
        setWeatherData(null);
        setError("No valid weather data returned");
        return;
      }

      if (!data.cityName || data.condition === "Unknown") {
        setWeatherData(null);
        setError("Location not found");
        return;
      }

      setWeatherData(data);
    } catch (e) {
      setWeatherData(null);
      if (e instanceof ApiClientError) {
        switch (e.problem.code) {
          case "NOT_FOUND":
            setError("Location not found");
            break;
          case "RATE_LIMITED":
            setError("Too many requests. Please try again shortly.");
            break;
          case "UNAUTHENTICATED":
            setError("Invalid API key");
            break;
          case "NETWORK_ERROR":
            setError("Network error. Check your connection.");
            break;
          case "TIMEOUT":
            setError("Request timed out. Please try again.");
            break;
          default:
            setError("Failed to fetch weather data");
        }
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function searchCity(cityRaw: string) {
    const city = cityRaw.trim();
    if (!city) return;

    setUserInput(city);
    addRecentLocation(city);
    await fetchWeatherData(city);
  }

  // initial fetch (respects searchMode)
  useEffect(() => {
    fetchWeatherData(initialCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if user changes UK/GLOBAL, refetch current city using the new mode
  useEffect(() => {
    const city = userInput.trim();
    if (!city) return;
    fetchWeatherData(city);
  }, [searchMode]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setUserInput(initialCity);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setIsLoading(true);
          setError(null);

          const { latitude, longitude } = pos.coords;
          const data = await weatherService.getWeatherByCoords(
            latitude,
            longitude,
          );

          if (
            !isValidWeatherData(data) ||
            !data.cityName ||
            data.condition === "Unknown"
          ) {
            setWeatherData(null);
            setError("Could not load weather for your location");
            setUserInput(initialCity);
            return;
          }

          setWeatherData(data);
          setUserInput(data.cityName);
          addRecentLocation(data.cityName);
        } catch (e) {
          setWeatherData(null);
          setError(
            e instanceof Error ? e.message : "Could not load your location",
          );
          setUserInput(initialCity);
        } finally {
          setIsLoading(false);
        }
      },
      () => setUserInput(initialCity),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }, [weatherService, initialCity]);

  return {
    userInput,
    weatherData,
    isLoading,
    error,
    recentLocations,
    handleSetInput,
    searchCity,
    searchMode,
    setSearchMode,
  };
}
