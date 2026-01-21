type StoredLocationsProps = {
  locations: string[];
  onSelect: (city: string) => void;
};

export function StoredLocations({ locations, onSelect }: StoredLocationsProps) {
  if (locations.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 text-sm opacity-80">
      <span
        className="
    block
    text-xs
    text-white/60
    tracking-wide
    uppercase
  "
      >
        Recently searched
      </span>

      {locations.map((city) => (
        <button
          key={city}
          onClick={() => onSelect(city)}
          className="block text-left hover:opacity-100 transition cursor-pointer"
          type="button"
        >
          {city}
        </button>
      ))}
    </div>
  );
}
