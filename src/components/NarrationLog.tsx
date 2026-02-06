import type { TurnSummary } from "../types/game";
import { OUTCOME_STYLES } from "../config/constants";

interface NarrationLogProps {
  history: TurnSummary[];
}

// Map outcome tiers to left-border colors for history (at 0.6 opacity multiplied)
const HISTORY_BORDER_COLORS: Record<string, string> = {
  critical_success: "#999",
  success: "#555",
  partial: "#333",
  failure: "#992020",
};

export default function NarrationLog({ history }: NarrationLogProps) {
  if (history.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      {history.map((turn) => {
        const style = OUTCOME_STYLES[turn.tier] ?? OUTCOME_STYLES.success;
        const borderColor = HISTORY_BORDER_COLORS[turn.tier] ?? "#333";

        return (
          <div key={turn.turn} style={{ marginBottom: 20 }}>
            {/* Narration text — dimmed */}
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              {turn.narration}
            </p>

            {/* Choice marker */}
            <div
              style={{
                borderLeft: "3px solid #333",
                paddingLeft: 12,
                color: "#555",
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              ▸ {turn.choice}
            </div>

            {/* Outcome — reduced opacity border/tint */}
            <div
              style={{
                borderLeft: `3px solid ${borderColor}`,
                paddingLeft: 12,
                paddingTop: 4,
                paddingBottom: 4,
                fontSize: 13,
                color: turn.tier === "failure" ? "#992020" : "#555",
                lineHeight: 1.7,
              }}
            >
              <span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase" as const }}>
                {style.label}
              </span>
              <p style={{ marginTop: 2 }}>{turn.outcome}</p>
            </div>

            {/* Divider */}
            <div style={{ borderBottom: "1px solid #1a1a1a", marginTop: 20 }} />
          </div>
        );
      })}
    </div>
  );
}
