import type { GameState } from "../types/game";
import HighlightReel from "./HighlightReel";

interface VictoryScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function VictoryScreen({ state, onRestart }: VictoryScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="font-display text-5xl text-gold tracking-wider mb-2">
        VICTORIOUS
      </h1>
      <p className="text-parchment-dim italic text-lg mb-8">
        You have conquered the dungeon and claimed the Throne Below.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-10 text-center">
        <div>
          <div className="font-display text-3xl text-gold">10</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">FLOORS CLEARED</div>
        </div>
        <div>
          <div className="font-display text-3xl text-gold">{state.turnCount}</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">TURNS TAKEN</div>
        </div>
        <div>
          <div className="font-display text-3xl text-gold">{state.playerClass?.emoji}</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">{state.playerClass?.name}</div>
        </div>
        <div>
          <div className="font-display text-3xl text-gold">
            {state.hp}/{state.maxHp}
          </div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">FINAL HP</div>
        </div>
      </div>

      <HighlightReel highlights={state.highlights} grokApiKey={state.grokApiKey} />

      <button
        onClick={onRestart}
        className="font-display text-xl text-gold tracking-widest px-12 py-4 rounded-lg border border-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-300 mt-8"
      >
        DESCEND AGAIN
      </button>
    </div>
  );
}
