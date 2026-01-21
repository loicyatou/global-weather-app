import type { WeatherData } from "../types/weatherDomain";

type WeatherDetailsProps = {
  weatherData: WeatherData | null;
};

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  // Guard: no data yet
  if (!weatherData) {
    return (
      <div>
        <div className="mb-6 text-sm tracking-wide uppercase opacity-80">
          Weather Details
        </div>
        <div className="text-sm opacity-60">
          Search for a location to see details
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-sm tracking-wide uppercase opacity-80">
        Weather Details
      </div>

      <div className="space-y-4 text-sm">
        <DetailRow label="Humidity" value={`${weatherData.humidity}%`} />
        <DetailRow label="Min Temp" value={`${weatherData.minTemp}°c`} />
        <DetailRow label="Max Temp" value={`${weatherData.maxTemp}°c`} />
        <DetailRow label="Wind" value={`${weatherData.windSpeedMph} mph`} />
        <DetailRow
          label="Rain"
          value={`${weatherData.rainVolumeMmLastHour} mm`}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between opacity-80">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
