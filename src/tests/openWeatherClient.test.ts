import { describe, it, expect, beforeEach, afterEach } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { OpenWeatherClient } from "../components/services/openWeatherClient";

describe("OpenWeatherClient", () => {
  let mock: AxiosMockAdapter;

  afterEach(() => {
    mock?.restore();
  });

  it("injects defaultParams into every request", async () => {
    const client = new OpenWeatherClient({
      baseURL: "https://example.test",
      defaultParams: { appid: "KEY123" },
    });

    const axiosInstance =
      (client as any).client ??
      (client as any).axios ??
      (client as any).http ??
      (client as any).instance;

    if (!axiosInstance) {
      throw new Error(
        "Could not find axios instance on OpenWeatherClient. Expose it or update test accessor.",
      );
    }

    mock = new AxiosMockAdapter(axiosInstance);

    mock.onGet("/weather").reply((config) => {
      expect(config.params).toMatchObject({ appid: "KEY123", q: "London" });
      return [200, { ok: true }];
    });

    const res = await client.get<{ ok: boolean }>("/weather", {
      params: { q: "London" },
    });

    expect(res.ok).toBe(true);
  });

  it("allows request params to override defaults (if needed)", async () => {
    const client = new OpenWeatherClient({
      baseURL: "https://example.test",
      defaultParams: { appid: "DEFAULT" },
    });

    const axiosInstance =
      (client as any).client ??
      (client as any).axios ??
      (client as any).http ??
      (client as any).instance;

    if (!axiosInstance) {
      throw new Error(
        "Could not find axios instance on OpenWeatherClient. Expose it or update test accessor.",
      );
    }

    mock = new AxiosMockAdapter(axiosInstance);

    mock.onGet("/weather").reply((config) => {
      expect(config.params).toMatchObject({ appid: "OVERRIDE" });
      return [200, { ok: true }];
    });

    const res = await client.get<{ ok: boolean }>("/weather", {
      params: { appid: "OVERRIDE" },
    });

    expect(res.ok).toBe(true);
  });
});
