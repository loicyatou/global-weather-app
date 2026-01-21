import clear from "@/assets/weather/clear.jpg";
import clouds from "@/assets/weather/clouds.jpg";
import rain from "@/assets/weather/rain.jpg";
import snow from "@/assets/weather/snow.jpg";
import thunder from "@/assets/weather/thunder.jpg";
import mist from "@/assets/weather/mist.jpg";

export type WeatherBackgroundKey =
  | "clear"
  | "clouds"
  | "rain"
  | "snow"
  | "thunder"
  | "mist";

export const weatherBackgroundMap: Record<WeatherBackgroundKey, string> = {
  clear,
  clouds,
  rain,
  snow,
  thunder,
  mist,
};
