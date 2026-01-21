import { describe, it, expect, vi } from "vitest";
import { WeatherService } from "../components/services/weatherService";
import type { WeatherData } from "../components/types/weatherDomain";

describe("WeatherService", () => {
  it("returns emptyWeatherData when geocoding returns no results", async () => {
    const fakeGeo = {
      getLocationCoordinates: vi.fn().mockResolvedValue([]),
    };

    const fakeClient = {
      get: vi.fn(),
    };

    const svc = new WeatherService(fakeClient as any, fakeGeo as any);

    const data = await svc.getCurrentWeather("Nowhere");

    expect(fakeGeo.getLocationCoordinates).toHaveBeenCalledWith("Nowhere");
    expect(fakeClient.get).not.toHaveBeenCalled();
    expect(data).toBeTruthy();
    expect((data as WeatherData).cityName).toBe("Nowhere");
  });

  it("calls /weather with lat/lon from best geocode result", async () => {
    const fakeGeo = {
      getLocationCoordinates: vi.fn().mockResolvedValue([{ lat: 51.5, lon: -0.12 }]),
    };

    const fakeRaw = {
      // shape that mapToWeatherData expects
      name: "London",
      weather: [{ main: "Rain", description: "light rain", icon: "10d" }],
      main: { temp: 10, feels_like: 8, humidity: 80, temp_min: 7, temp_max: 11 },
      wind: { speed: 4 },
      rain: { "1h": 1.2 },
    };

    const fakeClient = {
      get: vi.fn().mockResolvedValue(fakeRaw),
    };

    const svc = new WeatherService(fakeClient as any, fakeGeo as any);

    await svc.getCurrentWeather("London");

    expect(fakeClient.get).toHaveBeenCalledWith("/weather", {
      params: expect.objectContaining({
        lat: 51.5,
        lon: -0.12,
        units: "metric",
        lang: "en",
      }),
    });
  });

  it("maps API response into WeatherData domain object", async () => {
    const fakeGeo = {
      getLocationCoordinates: vi.fn().mockResolvedValue([{ lat: 1, lon: 2 }]),
    };

    const fakeRaw = {
      name: "London",
      weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }],
      main: { temp: 12.4, feels_like: 11.2, humidity: 65, temp_min: 10.1, temp_max: 14.9 },
      wind: { speed: 5.5 },
    };

    const fakeClient = {
      get: vi.fn().mockResolvedValue(fakeRaw),
    };

    const svc = new WeatherService(fakeClient as any, fakeGeo as any);

    const data = await svc.getCurrentWeather("London");

    expect(data).toBeTruthy();
    expect(data?.cityName).toBe("London");
    expect(data?.condition).toBeTruthy();
    expect(typeof data?.temperature).toBe("number");
  });
});
