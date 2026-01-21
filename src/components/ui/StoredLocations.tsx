type StoredLocationsProps = {
  locations: string[];
  onSelect: (city: string) => void;
};

export function StoredLocations({ locations, onSelect }: StoredLocationsProps) {
  if (locations.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 text-sm opacity-80">
      {locations.map((city) => (
        <button
          key={city}
          onClick={() => onSelect(city)}
          className="block text-left hover:opacity-100 transition"
          type="button"
        >
          {city}
        </button>
      ))}
    </div>
  );
}
