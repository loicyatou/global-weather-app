import { mapToLocationCoordinates } from "../mappers/locationMapper";
import type {
  LocationCoordinates,
  OpenWeatherGeocodingItem,
} from "../types/weatherDomain";
import { OpenWeatherClient } from "./openWeatherClient";

export class GeoCodingService {
  private readonly client: OpenWeatherClient;

  constructor(_client?: OpenWeatherClient) {
    this.client =
      _client ??
      new OpenWeatherClient({
        baseURL: import.meta.env.VITE_OPEN_GEOCODE_BASE_URL,
        defaultParams: {
          appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
        },
        onProblem: (p) => {
          console.warn("[OpenWeather Geocode] problem", {
            code: p.code,
            status: p.status,
            requestId: p.requestId,
            message: p.message,
          });
        }
      });
  }

  async getLocationCoordinates(city: string, countryCode?: string): Promise<LocationCoordinates[]> {
    const raw = await this.client.get<OpenWeatherGeocodingItem[]>("/direct", {
      params: {
        q: countryCode ? `${city},${countryCode}` : city,
        limit: 5,
      },
    });

    return raw.map((x) => mapToLocationCoordinates(x));
  }
}
