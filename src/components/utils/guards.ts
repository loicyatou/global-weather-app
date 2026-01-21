import type { WeatherData } from "../types/weatherDomain";

export function isValidWeatherData(data: unknown): data is WeatherData {
  if (!data || typeof data !== "object") return false;

  const d = data as Partial<WeatherData>;

  return (
    typeof d.temperature === "number" &&
    typeof d.feelsLike === "number" &&
    typeof d.humidity === "number" &&
    typeof d.minTemp === "number" &&
    typeof d.maxTemp === "number" &&
    typeof d.windSpeedMph === "number" &&
    typeof d.rainVolumeMmLastHour === "number" &&
    typeof d.condition === "string" &&
    typeof d.cityName === "string"
  );
}
