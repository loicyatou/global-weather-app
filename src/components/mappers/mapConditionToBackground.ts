import type { WeatherBackgroundKey } from "../utils/backgrounds";

//Recognised Weakness: If Open weather introduce a key that this does not cover
export function mapConditionToBackgroundKey(
  conditionMain?: string | null
): WeatherBackgroundKey {
  const main = (conditionMain ?? "").trim().toLowerCase();

  if (!main) return "clear";
  if (main.includes("thunder")) return "thunder";
  if (main.includes("rain") || main.includes("drizzle")) return "rain";
  if (main.includes("snow")) return "snow";
  if (main.includes("cloud")) return "clouds";
  if (
    main.includes("mist") ||
    main.includes("fog") ||
    main.includes("haze") ||
    main.includes("smoke") ||
    main.includes("dust") ||
    main.includes("sand") ||
    main.includes("ash") ||
    main.includes("squall") ||
    main.includes("tornado")
  ) {
    return "mist";
  }
  if (main.includes("clear")) return "clear";

  // Sensible fallback
  return "clear";
}
