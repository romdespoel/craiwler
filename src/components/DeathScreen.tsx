import type { GameState } from "../types/game";
import HighlightReel from "./HighlightReel";

interface DeathScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function DeathScreen({ state, onRestart }: DeathScreenProps) {
  const deathHighlight = state.highlights.find((h) => h.type === "death");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="font-display text-5xl text-failure tracking-wider mb-4">
        YOU HAVE FALLEN
      </h1>

      {deathHighlight && (
        <p className="text-parchment italic text-lg max-w-lg text-center mb-8">
          {deathHighlight.narration}
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 mb-10 text-center">
        <div>
          <div className="font-display text-3xl text-gold">{state.world.floor}</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">FLOOR REACHED</div>
        </div>
        <div>
          <div className="font-display text-3xl text-gold">{state.turnCount}</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">TURNS SURVIVED</div>
        </div>
        <div>
          <div className="font-display text-3xl text-gold">{state.playerClass?.emoji}</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">{state.playerClass?.name}</div>
        </div>
        <div>
          <div className="font-display text-3xl text-gold">{state.inventory.length}</div>
          <div className="text-xs font-display text-parchment-dim tracking-wider">ITEMS COLLECTED</div>
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
