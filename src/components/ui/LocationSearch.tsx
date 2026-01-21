import { useState } from "react";
import { Button } from "@/components/ui/button";

type SearchBoxProps = {
  onSearch: (city: string) => void;
};

export default function LocationSearch({ onSearch }: SearchBoxProps) {
  const [value, setValue] = useState("");

  function handleOnSearch(targetValue: string) {
    const city = targetValue.trim();
    if (city.length === 0) return;

    onSearch(city);
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 border-b border-white/30 pb-2">
        <input
          value={value}
          className="bg-transparent flex-1 outline-none placeholder-white/60"
          placeholder="Search city worldwide"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleOnSearch(value)}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOnSearch(value)}
          className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-1 focus-visible:ring-white/20"
        >
          🔍
        </Button>
      </div>
    </div>
  );
}
