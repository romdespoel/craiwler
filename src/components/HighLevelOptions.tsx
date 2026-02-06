import type { HighLevelOption } from "../types/game";

interface HighLevelOptionsProps {
  options: HighLevelOption[];
  selectedOption: HighLevelOption | null;
  onSelect: (option: HighLevelOption) => void;
  onLoadMore: () => void;
  loading: boolean;
  hasLoadedMore: boolean;
}

export default function HighLevelOptions({
  options,
  selectedOption,
  onSelect,
  onLoadMore,
  loading,
  hasLoadedMore,
}: HighLevelOptionsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption?.id === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              disabled={loading || (selectedOption !== null && !isSelected)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 animate-fade-in ${
                option.wild
                  ? isSelected
                    ? "border-wild bg-wild/15"
                    : "wild-pulse border-wild/60 hover:bg-wild/10"
                  : isSelected
                  ? "border-gold bg-gold/10"
                  : "border-gold-dim/30 hover:border-gold-dim/60 bg-abyss-light"
              } ${
                selectedOption !== null && !isSelected
                  ? "opacity-30 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{option.emoji}</span>
                <span className="font-display text-sm text-gold tracking-wide">
                  {option.label}
                </span>
                {option.wild && (
                  <span className="text-[10px] font-display tracking-widest text-wild bg-wild/20 px-1.5 py-0.5 rounded">
                    WILD
                  </span>
                )}
              </div>
              <p className="text-parchment-dim text-sm">{option.hint}</p>
            </button>
          );
        })}
      </div>

      {/* Load More */}
      {!hasLoadedMore && !selectedOption && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="w-full py-2 text-sm font-display text-parchment-dim/60 tracking-wider hover:text-parchment-dim transition-colors border border-dashed border-gold-dim/20 rounded hover:border-gold-dim/40"
        >
          REVEAL MORE OPTIONS
        </button>
      )}
    </div>
  );
}
