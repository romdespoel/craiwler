import type { SubOption } from "../types/game";
import { STAT_COLORS, STAT_BG_COLORS, STAT_LABELS } from "../config/constants";

interface SubOptionsProps {
  subOptions: SubOption[];
  onSelect: (subOption: SubOption) => void;
  loading: boolean;
}

export default function SubOptions({ subOptions, onSelect, loading }: SubOptionsProps) {
  return (
    <div className="ml-4 mt-3 space-y-2 border-l-2 border-gold-dim/20 pl-4">
      {subOptions.map((sub, idx) => {
        const statColor = STAT_COLORS[sub.stat_check] ?? STAT_COLORS.none;
        const statBg = STAT_BG_COLORS[sub.stat_check] ?? STAT_BG_COLORS.none;
        const statLabel = STAT_LABELS[sub.stat_check] ?? "—";

        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub)}
            disabled={loading}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 animate-slide-in ${
              sub.wild
                ? "wild-pulse border-wild/60 hover:bg-wild/10"
                : "border-gold-dim/20 hover:border-gold-dim/50 bg-abyss-light"
            } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-parchment">
                  {sub.label}
                </span>
                {sub.wild && (
                  <span className="text-[10px] font-display tracking-widest text-wild bg-wild/20 px-1.5 py-0.5 rounded">
                    WILD
                  </span>
                )}
              </div>
              {sub.stat_check !== "none" && (
                <span
                  className={`text-[11px] font-display tracking-wider px-2 py-0.5 rounded ${statColor} ${statBg}`}
                >
                  {statLabel} {sub.difficulty}/10
                </span>
              )}
            </div>
            <p className="text-parchment-dim text-sm">{sub.description}</p>
          </button>
        );
      })}
    </div>
  );
}
