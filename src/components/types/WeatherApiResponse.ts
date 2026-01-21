export interface OpenWeatherWeatherApiResponse {
  coord: { lon: number; lat: number };

  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;

  base: string;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };

  visibility?: number;

  wind: {
    speed: number; 
    deg?: number;
    gust?: number;
  };

  rain?: {
    /* Rain volume for last 1 hour, mm */
    "1h"?: number;
    /* Rain volume for last 3 hours, mm */
    "3h"?: number;
  };

  clouds?: {
    all: number;
  };

  dt: number;

  sys: {
    country: string;
    sunrise?: number;
    sunset?: number;
  };

  timezone: number;
  id: number;
  name: string;
  cod: number;
}
