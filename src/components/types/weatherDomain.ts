export interface LocationCoordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface OpenWeatherGeocodingItem {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}

export interface WeatherData {
  temperature: number;     
  feelsLike: number;      
  humidity: number;        
  minTemp: number;        
  maxTemp: number;        
  windSpeedMph: number;   
  rainVolumeMmLastHour: number;
  condition: string;       
  description: string;     
  cityName: string;  
  weatherIconUrl: string;      
}

export function emptyWeatherData(cityName: string): WeatherData {
    return {
      temperature: 0,
      feelsLike: 0,
      humidity: 0,
      minTemp: 0,
      maxTemp: 0,
      windSpeedMph: 0,
      rainVolumeMmLastHour: 0,
      condition: "Unknown",
      description: "",
      cityName,
      weatherIconUrl: ""
    };
}
