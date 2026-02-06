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

// Monochrome border system — only red for death/wild_failure/failure-related
const TYPE_BORDER_COLORS: Record<string, string> = {
  critical_success: "#ffffff",
  death: "#ff3333",
  wild_success: "#888",
  wild_failure: "#ff3333",
  boss_encounter: "#888",
  major_loss: "#555",
  major_gain: "#888",
  close_call: "#555",
  victory: "#ffffff",
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
    <div style={{ width: "100%", maxWidth: 480 }}>
      <h3 style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 16, textAlign: "center", textTransform: "uppercase" as const }}>
        HIGHLIGHT REEL
      </h3>
      <div>
        {top.map((hl, idx) => (
          <div
            key={`${hl.turn}-${idx}`}
            className="animate-fade-in"
            style={{
              borderLeft: `3px solid ${TYPE_BORDER_COLORS[hl.type] ?? "#333"}`,
              padding: "10px 14px",
              marginBottom: 1,
              background: "#0a0a0a",
              animationDelay: `${idx * 150}ms`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>
                {TYPE_LABELS[hl.type] ?? hl.type}
              </span>
              <span style={{ fontSize: 10, color: "#333", letterSpacing: 1 }}>
                Turn {hl.turn} — Floor {hl.floor}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{hl.narration}</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
              ▸ {hl.choice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
