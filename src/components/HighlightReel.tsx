import type { Highlight } from "../types/game";

interface HighlightReelProps {
  highlights: Highlight[];
}

const TYPE_LABELS: Record<string, string> = {
  critical_success: "Critical Success",
  death: "Final Moment",
  wild_success: "Wild Gambit Pays Off",
  wild_failure: "Wild Gambit Backfires",
  boss_encounter: "Boss Encounter",
  major_loss: "A Bitter Loss",
  major_gain: "A Lucky Find",
  close_call: "A Narrow Escape",
  victory: "Victory",
};

const TYPE_COLORS: Record<string, string> = {
  critical_success: "border-l-critical",
  death: "border-l-failure",
  wild_success: "border-l-wild",
  wild_failure: "border-l-wild",
  boss_encounter: "border-l-gold",
  major_loss: "border-l-partial",
  major_gain: "border-l-success",
  close_call: "border-l-partial",
  victory: "border-l-gold",
};

export default function HighlightReel({ highlights }: HighlightReelProps) {
  // Select top 5 highlights by dramatic weight, deduplicated by turn
  const seen = new Set<number>();
  const top = highlights
    .sort((a, b) => b.dramaticWeight - a.dramaticWeight)
    .filter((h) => {
      if (seen.has(h.turn)) return false;
      seen.add(h.turn);
      return true;
    })
    .slice(0, 5)
    .sort((a, b) => a.turn - b.turn);

  if (top.length === 0) return null;

  return (
    <div className="w-full max-w-lg">
      <h3 className="font-display text-sm text-parchment-dim tracking-widest mb-4 text-center">
        HIGHLIGHT REEL
      </h3>
      <div className="space-y-3">
        {top.map((hl, idx) => (
          <div
            key={`${hl.turn}-${idx}`}
            className={`pl-4 border-l-2 ${
              TYPE_COLORS[hl.type] ?? "border-l-parchment-dim"
            } py-2 pr-3 rounded-r bg-abyss-light animate-fade-in`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-display text-gold tracking-wider">
                {TYPE_LABELS[hl.type] ?? hl.type}
              </span>
              <span className="text-[10px] font-display text-parchment-dim tracking-wider">
                Turn {hl.turn} — Floor {hl.floor}
              </span>
            </div>
            <p className="text-sm text-parchment/80 italic">{hl.narration}</p>
            <p className="text-xs text-parchment-dim mt-1">
              Action: <span className="text-gold">{hl.choice}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
