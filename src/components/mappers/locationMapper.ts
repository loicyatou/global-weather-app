import type { LocationCoordinates, OpenWeatherGeocodingItem } from "../types/weatherDomain";

export function mapToLocationCoordinates(
  raw: OpenWeatherGeocodingItem,
): LocationCoordinates {
  return {
    name: raw.name,
    lat: raw.lat,
    lon: raw.lon,
    country: raw.country,
    state: raw.state,
  };
}
