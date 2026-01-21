import { describe, it, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { OpenWeatherClient } from "../components/services/openWeatherClient";

describe("OpenWeatherClient", () => {
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("injects defaultParams into every request", async () => {
    const client = new OpenWeatherClient({
      baseURL: "https://example.test",
      defaultParams: { appid: "KEY123" },
    });

    mock.onGet("https://example.test/weather").reply((config) => {
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

    mock.onGet("https://example.test/weather").reply((config) => {
      expect(config.params).toMatchObject({ appid: "OVERRIDE" });
      return [200, { ok: true }];
    });

    const res = await client.get<{ ok: boolean }>("/weather", {
      params: { appid: "OVERRIDE" },
    });

    expect(res.ok).toBe(true);
  });
});
