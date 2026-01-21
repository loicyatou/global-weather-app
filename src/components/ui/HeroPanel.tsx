import type { WeatherData } from "../types/weatherDomain";

export type HeroPanelProps = {
  weatherData: WeatherData | null;
};

function formatTemp(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${Math.round(value)}°c`;
}

export function HeroPanel({ weatherData }: HeroPanelProps) {
  const temp = weatherData ? formatTemp(weatherData.temperature) : "—";
  const feels = weatherData ? formatTemp(weatherData.feelsLike) : "—";
  const city = weatherData?.cityName ?? "—";
  const condition = weatherData?.condition ?? "—";
  const weatherIconUrl = weatherData?.weatherIconUrl;

  return (
    <section className="h-full min-h-screen p-10 text-white flex flex-col">
      <div className="text-sm tracking-wide opacity-80">bright.weather</div>
      <div className="flex-1" />
      <div className="flex items-end gap-12 pb-6">
        <div className="text-[120px] leading-none font-light">{temp}</div>

        <div className="pb-3">
          <div className="text-4xl font-medium">{city}</div>
          <div className="text-lg opacity-80">Feels like {feels}</div>
        </div>

        <div className="pb-4 flex flex-col items-center gap-1">
          {weatherIconUrl && (
            <img
              src={weatherIconUrl}
              alt={condition}
              className="w-12 h-12 opacity-80"
            />
          )}
          <span className="text-base font-light opacity-90">{condition}</span>
        </div>
      </div>
    </section>
  );
}
