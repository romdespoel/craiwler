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

// Outcome tier left-border colors per spec
const OUTCOME_BORDER_COLORS: Record<string, string> = {
  critical_success: "#ffffff",
  success: "#888888",
  partial: "#555555",
  failure: "#ff3333",
};

const OUTCOME_BG_TINTS: Record<string, string> = {
  critical_success: "rgba(255,255,255,0.03)",
  success: "rgba(255,255,255,0.02)",
  partial: "rgba(255,255,255,0.01)",
  failure: "rgba(255,51,51,0.05)",
};

const OUTCOME_TEXT_COLORS: Record<string, string> = {
  critical_success: "#ffffff",
  success: "#bbbbbb",
  partial: "#888888",
  failure: "#ff3333",
};

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

  // Reset narration state when narration changes
  useEffect(() => {
    setNarrationDone(false);
    setHasLoadedMore(false);
  }, [state.currentNarration]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.currentNarration, state.currentOptions, state.currentSubOptions, state.loading, state.lastOutcome]);

  const handleLoadMore = () => {
    setHasLoadedMore(true);
    onLoadMore();
  };

  return (
    <div
      style={{
        background: "#050505",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        padding: 32,
        fontSize: 13,
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <StatsBar state={state} />

        {/* Turn history */}
        <NarrationLog history={state.history} />

        {/* Last outcome */}
        {state.lastOutcome && (
          <div
            className="animate-fade-in"
            style={{
              marginBottom: 24,
              padding: "10px 14px",
              borderLeft: `3px solid ${OUTCOME_BORDER_COLORS[state.lastOutcome.tier] ?? "#555"}`,
              background: OUTCOME_BG_TINTS[state.lastOutcome.tier] ?? "transparent",
              fontSize: 14,
              lineHeight: 1.7,
              color: OUTCOME_TEXT_COLORS[state.lastOutcome.tier] ?? "#bbb",
            }}
          >
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" as const }}>
              {OUTCOME_STYLES[state.lastOutcome.tier]?.label ?? state.lastOutcome.tier}
            </div>
            <p>{state.lastOutcome.narration}</p>
          </div>
        )}

        {/* Current narration */}
        {state.currentNarration && (
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#bbb",
              padding: "16px 0",
              borderTop: "1px solid #1a1a1a",
              borderBottom: "1px solid #1a1a1a",
              marginBottom: 28,
            }}
          >
            <TypewriterText
              text={state.currentNarration}
              onComplete={() => setNarrationDone(true)}
            />
          </div>
        )}

        {/* Error state */}
        {state.error && (
          <div
            className="animate-fade-in"
            style={{
              marginBottom: 24,
              padding: "12px 16px",
              borderLeft: "3px solid #ff3333",
              background: "rgba(255,51,51,0.05)",
            }}
          >
            <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>{state.error}</p>
            <button
              onClick={onRetryAfterError}
              style={{
                background: "transparent",
                border: "1px solid #333",
                color: "#888",
                padding: "8px 16px",
                fontSize: 11,
                letterSpacing: 1,
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                textTransform: "uppercase",
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Loading */}
        {state.loading && <LoadingIndicator message={state.loadingMessage} />}

        {/* Options area */}
        {!state.loading && !state.error && narrationDone && state.currentOptions.length > 0 && (
          <div className="animate-fade-in">
            <HighLevelOptions
              options={state.currentOptions}
              selectedOption={state.selectedOption}
              onSelect={onSelectOption}
              onLoadMore={handleLoadMore}
              loading={state.loading}
              hasLoadedMore={hasLoadedMore}
            />

            {/* Sub-options */}
            {state.selectedOption && state.currentSubOptions && (
              <>
                <SubOptions
                  subOptions={state.currentSubOptions}
                  onSelect={onSelectSubOption}
                  loading={state.loading}
                />
                <CustomInput
                  onSubmit={onSubmitCustomInput}
                  loading={state.loading}
                />
                <BackToOptions onClick={onClearSelection} />
              </>
            )}
          </div>
        )}

        {/* Inventory strip at bottom */}
        <InventoryStrip items={state.inventory} />

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function BackToOptions({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "transparent",
        border: "none",
        color: hovered ? "#888" : "#333",
        fontSize: 11,
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        marginTop: 8,
      }}
    >
      ← back
    </button>
  );
}
