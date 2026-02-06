import { useState } from "react";
import type { GameState } from "../types/game";
import HighlightReel from "./HighlightReel";

interface DeathScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function DeathScreen({ state, onRestart }: DeathScreenProps) {
  const deathHighlight = state.highlights.find((h) => h.type === "death");
  const [hoveredRestart, setHoveredRestart] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        background: "#050505",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      }}
    >
      {/* Floor number */}
      <div style={{ fontSize: 48, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
        FLOOR {state.world.floor}
      </div>

      {/* Title */}
      <div style={{ fontSize: 14, letterSpacing: 6, color: "#ff3333", marginBottom: 24, textTransform: "uppercase" as const }}>
        YOU HAVE FALLEN
      </div>

      {/* Death narration */}
      {deathHighlight && (
        <p style={{ color: "#888", fontSize: 14, maxWidth: 480, textAlign: "center", lineHeight: 1.7, marginBottom: 24 }}>
          {deathHighlight.narration}
        </p>
      )}

      {/* Survived info */}
      <div style={{ color: "#555", fontSize: 13, marginBottom: 40 }}>
        survived {state.turnCount} turns as {state.playerClass?.name}
      </div>

      {/* Highlight reel */}
      <HighlightReel highlights={state.highlights} grokApiKey={state.grokApiKey} />

      {/* Buttons */}
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        <button
          onClick={onRestart}
          onMouseEnter={() => setHoveredRestart(true)}
          onMouseLeave={() => setHoveredRestart(false)}
          style={{
            border: `1px solid ${hoveredRestart ? "#fff" : "#333"}`,
            background: "transparent",
            color: hoveredRestart ? "#fff" : "#888",
            padding: "12px 24px",
            fontSize: 12,
            letterSpacing: 2,
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            textTransform: "uppercase" as const,
          }}
        >
          DESCEND AGAIN
        </button>
      </div>
    </div>
  );
}
