import { useRef, useEffect, useState } from "react";
import type { GameState, HighLevelOption, SubOption } from "../types/game";
import StatsBar from "./StatsBar";
import InventoryStrip from "./InventoryStrip";
import NarrationLog from "./NarrationLog";
import TypewriterText from "./TypewriterText";
import HighLevelOptions from "./HighLevelOptions";
import SubOptions from "./SubOptions";
import CustomInput from "./CustomInput";
import LoadingIndicator from "./LoadingIndicator";
import { OUTCOME_STYLES } from "../config/constants";

interface GameScreenProps {
  state: GameState;
  onSelectOption: (option: HighLevelOption) => void;
  onSelectSubOption: (subOption: SubOption) => void;
  onSubmitCustomInput: (input: string) => void;
  onLoadMore: () => void;
  onClearSelection: () => void;
  onRetryAfterError: () => void;
}

export default function GameScreen({
  state,
  onSelectOption,
  onSelectSubOption,
  onSubmitCustomInput,
  onLoadMore,
  onClearSelection,
  onRetryAfterError,
}: GameScreenProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [narrationDone, setNarrationDone] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [prevNarration, setPrevNarration] = useState(state.currentNarration);

  // Reset narration-dependent state when narration text changes
  // (React-recommended pattern for adjusting state based on prop changes)
  if (prevNarration !== state.currentNarration) {
    setPrevNarration(state.currentNarration);
    setNarrationDone(false);
    setHasLoadedMore(false);
  }

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.currentNarration, state.currentOptions, state.currentSubOptions, state.loading, state.lastOutcome]);

  const handleLoadMore = () => {
    setHasLoadedMore(true);
    onLoadMore();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StatsBar state={state} />
      <InventoryStrip items={state.inventory} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Turn history */}
        <NarrationLog history={state.history} />

        {/* Last outcome */}
        {state.lastOutcome && (
          <div
            className={`mb-6 pl-4 border-l-2 ${
              OUTCOME_STYLES[state.lastOutcome.tier]?.border ?? "border-l-parchment-dim"
            } ${OUTCOME_STYLES[state.lastOutcome.tier]?.bg ?? ""} py-3 pr-3 rounded-r animate-fade-in`}
          >
            <div className="text-xs font-display text-parchment-dim tracking-wider mb-1">
              {OUTCOME_STYLES[state.lastOutcome.tier]?.label ?? state.lastOutcome.tier}
            </div>
            <p className="text-parchment italic">{state.lastOutcome.narration}</p>
          </div>
        )}

        {/* Current narration */}
        {state.currentNarration && (
          <div className="mb-6">
            <TypewriterText
              text={state.currentNarration}
              className="text-lg text-parchment leading-relaxed"
              onComplete={() => setNarrationDone(true)}
            />
          </div>
        )}

        {/* Error state */}
        {state.error && (
          <div className="mb-6 p-4 border border-failure/50 bg-failure/10 rounded-lg animate-fade-in">
            <p className="text-parchment-dim italic mb-3">{state.error}</p>
            <button
              onClick={onRetryAfterError}
              className="font-display text-sm text-gold tracking-wider border border-gold/40 px-4 py-1.5 rounded hover:bg-gold/10 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Loading — only show standalone when no options are visible yet */}
        {state.loading && state.currentOptions.length === 0 && (
          <LoadingIndicator message={state.loadingMessage} />
        )}

        {/* Options area — stay visible while loading sub-options */}
        {!state.error && narrationDone && state.currentOptions.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <HighLevelOptions
              options={state.currentOptions}
              selectedOption={state.selectedOption}
              onSelect={onSelectOption}
              onLoadMore={handleLoadMore}
              loading={state.loading}
              hasLoadedMore={hasLoadedMore}
            />

            {/* Inline loading for sub-options */}
            {state.selectedOption && state.loading && !state.currentSubOptions && (
              <div className="ml-4 mt-3 border-l-2 border-gold-dim/20 pl-4">
                <LoadingIndicator message={state.loadingMessage} />
              </div>
            )}

            {/* Sub-options */}
            {state.selectedOption && state.currentSubOptions && (
              <>
                <SubOptions
                  subOptions={state.currentSubOptions}
                  onSelect={onSelectSubOption}
                  loading={state.loading}
                />
                {/* Resolution loading — shown after picking a sub-option */}
                {state.loading ? (
                  <div className="ml-4 mt-3 border-l-2 border-gold-dim/20 pl-4">
                    <LoadingIndicator message={state.loadingMessage} />
                  </div>
                ) : (
                  <>
                    <CustomInput
                      onSubmit={onSubmitCustomInput}
                      loading={state.loading}
                    />
                    <button
                      onClick={onClearSelection}
                      className="text-xs font-display text-parchment-dim/40 tracking-wider hover:text-parchment-dim transition-colors mt-2"
                    >
                      ← BACK TO OPTIONS
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
