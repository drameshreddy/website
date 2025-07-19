export type FilterType = "all" | "air" | "energy" | "waste" | "water"; // ✅ Added "water"

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const filters: FilterType[] = ["all", "air", "energy", "waste", "water"]; // ✅ Include "water"

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm capitalize border ${
            activeFilter === filter
              ? "bg-primary text-white"
              : "bg-muted text-foreground"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
