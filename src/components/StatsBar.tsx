import type { GameState } from "../types/game";

interface StatsBarProps {
  state: GameState;
}

export default function StatsBar({ state }: StatsBarProps) {
  const hpPercent = (state.hp / state.maxHp) * 100;
  const hpColor =
    hpPercent > 60 ? "bg-success" : hpPercent > 30 ? "bg-partial" : "bg-failure";

  return (
    <div className="sticky top-0 z-10 bg-abyss/95 backdrop-blur border-b border-gold-dim/20 px-4 py-3">
      <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-2">
        {/* Location & Floor */}
        <div className="flex items-center gap-2">
          <span className="font-display text-sm text-gold tracking-wider">
            F{state.world.floor}
          </span>
          <span className="text-parchment-dim text-sm">
            {state.world.location || "Dungeon"}
          </span>
        </div>

        {/* HP Bar */}
        <div className="flex items-center gap-2">
          <span className="font-display text-xs text-parchment-dim tracking-wider">HP</span>
          <div className="w-28 h-2 bg-abyss-lighter rounded-full overflow-hidden">
            <div
              className={`h-full ${hpColor} transition-all duration-500 rounded-full`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-xs text-parchment-dim">
            {state.hp}/{state.maxHp}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 text-xs font-display tracking-wider">
          <span className="text-str">STR {state.stats.strength}</span>
          <span className="text-cha">CHA {state.stats.charisma}</span>
          <span className="text-cre">CRE {state.stats.creativity}</span>
        </div>

        {/* Gold */}
        <span className="text-xs text-gold font-display tracking-wider">
          {state.gold} Gold
        </span>
      </div>
    </div>
  );
}
