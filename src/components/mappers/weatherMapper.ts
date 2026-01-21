import type { WeatherData } from "../types/weatherDomain";
import type { OpenWeatherWeatherApiResponse } from "../types/WeatherApiResponse";

const MS_TO_MPH = 2.236936;

export function mapToWeatherData(
  raw: OpenWeatherWeatherApiResponse,
): WeatherData {
  const firstWeather = raw.weather?.[0];

  const windMph =
    typeof raw.wind?.speed === "number" ? raw.wind.speed * MS_TO_MPH : 0;

  const rain1h =
    raw.rain && typeof raw.rain["1h"] === "number" ? raw.rain["1h"] : 0;

  const rawWeatherIconUrl = import.meta.env.VITE_OPEN_WEATHER_ICON_URL;

  const weatherIconUrl = firstWeather.icon
    ? rawWeatherIconUrl.replace("{iconKey}", firstWeather.icon)
    : null;

  return {
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    minTemp: Math.round(raw.main.temp_min),
    maxTemp: Math.round(raw.main.temp_max),
    windSpeedMph: Math.round(windMph),
    rainVolumeMmLastHour: rain1h,
    condition: firstWeather?.main ?? "Unknown",
    description: firstWeather?.description ?? "",
    cityName: raw.name ?? "",
    weatherIconUrl: weatherIconUrl,
  };
}
