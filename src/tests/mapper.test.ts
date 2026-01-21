import { describe, it, expect } from "vitest";
import { mapConditionToBackgroundKey } from "../components/mappers/mapConditionToBackground";

describe("mapConditionToBackgroundKey", () => {
  it("maps common conditions to buckets", () => {
    expect(mapConditionToBackgroundKey("Clear")).toBe("clear");
    expect(mapConditionToBackgroundKey("Clouds")).toBe("clouds");
    expect(mapConditionToBackgroundKey("Rain")).toBe("rain");
    expect(mapConditionToBackgroundKey("Drizzle")).toBe("rain");
    expect(mapConditionToBackgroundKey("Thunderstorm")).toBe("thunder");
    expect(mapConditionToBackgroundKey("Mist")).toBe("mist");
  });
});
