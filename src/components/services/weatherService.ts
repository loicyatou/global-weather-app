import { mapToWeatherData } from "../mappers/weatherMapper";
import type { OpenWeatherWeatherApiResponse } from "../types/WeatherApiResponse";
import { emptyWeatherData, type WeatherData } from "../types/weatherDomain";
import { GeoCodingService } from "./geoCodingService";
import { OpenWeatherClient } from "./openWeatherClient";

export class WeatherService {
  private readonly client: OpenWeatherClient;
  private readonly geoCodingService: GeoCodingService;

  constructor(
    _client?: OpenWeatherClient,
    _geoCodingService?: GeoCodingService,
  ) {
    this.client =
      _client ??
      new OpenWeatherClient({
        baseURL: import.meta.env.VITE_OPEN_WEATHER_BASE_URL,
        defaultParams: {
          appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
          units: "metric",
          lang: "en",
        },
        onProblem: (p) => {
          console.warn("[OpenWeather] problem", {
            code: p.code,
            status: p.status,
            requestId: p.requestId,
            message: p.message,
          });
        },
      });

    this.geoCodingService = _geoCodingService ?? new GeoCodingService();
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const raw = await this.client.get<OpenWeatherWeatherApiResponse>(
      "/weather",
      {
        params: {
          lat,
          lon,
        },
      },
    );

    return mapToWeatherData(raw);
  }

  async getCurrentWeather(cityName: string, countryCode?: string): Promise<WeatherData | null> {
    const results =
      await this.geoCodingService.getLocationCoordinates(cityName,countryCode);

    if (!results || results.length === 0) {
      return emptyWeatherData(cityName);
    }

    const best = results[0]; //An assumption that can be fixed using a similarity matrix but beyond the scope

    if (typeof best.lat !== "number" || typeof best.lon !== "number") {
      return emptyWeatherData(cityName);
    }

    const raw = await this.client.get<OpenWeatherWeatherApiResponse>(
      "/weather",
      {
        params: {
          lat: best.lat,
          lon: best.lon,
          units: "metric",
          lang: "en",
        },
      },
    );

    return mapToWeatherData(raw);
  }
}
