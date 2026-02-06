import type { TurnSummary } from "../types/game";
import { OUTCOME_STYLES } from "../config/constants";

interface NarrationLogProps {
  history: TurnSummary[];
}

export default function NarrationLog({ history }: NarrationLogProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 opacity-70">
      {history.map((turn) => {
        const style = OUTCOME_STYLES[turn.tier] ?? OUTCOME_STYLES.success;
        return (
          <div
            key={turn.turn}
            className={`pl-4 border-l-2 ${style.border} ${style.bg} py-2 pr-3 rounded-r text-sm`}
          >
            <div className="text-parchment-dim text-xs mb-1 font-display tracking-wider">
              Turn {turn.turn} — Floor {turn.floor}
            </div>
            <p className="text-parchment/80 italic mb-1">{turn.narration}</p>
            <p className="text-parchment-dim text-xs">
              Chose: <span className="text-gold">{turn.choice}</span> — {style.label}
            </p>
            <p className="text-parchment/70 text-sm mt-1">{turn.outcome}</p>
          </div>
        );
      })}
    </div>
  );
}
