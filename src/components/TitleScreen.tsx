import { useState } from "react";
import type { PlayerClass } from "../types/game";
import { CLASSES } from "../config/classes";

interface TitleScreenProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onStart: (playerClass: PlayerClass) => void;
}

export default function TitleScreen({ apiKey, onApiKeyChange, onStart }: TitleScreenProps) {
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [hoveredStart, setHoveredStart] = useState(false);

  const canStart = apiKey.trim().length > 0 && selectedClass !== null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background: "#050505",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, color: "#fff", marginBottom: 8, textTransform: "uppercase" as const }}>
        DEPTHS UNKNOWN
      </h1>
      <p style={{ fontSize: 13, color: "#555", marginBottom: 48 }}>
        choose your path
      </p>

      {/* Divider */}
      <div style={{ width: 200, borderBottom: "1px solid #1a1a1a", marginBottom: 32 }} />

      {/* API Key */}
      <div style={{ width: "100%", maxWidth: 420, marginBottom: 40 }}>
        <label style={{ display: "block", fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" as const }}>
          ANTHROPIC API KEY
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-ant-..."
          style={{
            width: "100%",
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
            color: "#e0e0e0",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            fontSize: 14,
            padding: "10px 14px",
            outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#333"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; }}
        />
        <p style={{ color: "#333", fontSize: 11, marginTop: 6 }}>
          Your key is used client-side only and never stored.
        </p>
      </div>

      {/* Class Selection — 3-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1,
          background: "#1a1a1a",
          width: "100%",
          maxWidth: 580,
          marginBottom: 40,
        }}
      >
        {CLASSES.map((cls) => {
          const isSelected = selectedClass?.name === cls.name;
          const isHovered = hoveredClass === cls.name;
          const inverted = isSelected || isHovered;

          return (
            <button
              key={cls.name}
              onClick={() => setSelectedClass(cls)}
              onMouseEnter={() => setHoveredClass(cls.name)}
              onMouseLeave={() => setHoveredClass(null)}
              style={{
                background: inverted ? "#fff" : "#0a0a0a",
                color: inverted ? "#000" : "#e0e0e0",
                padding: "18px 14px",
                textAlign: "center",
                cursor: "pointer",
                border: "none",
                transition: "all 0.15s",
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" as const }}>
                {cls.name.replace("The ", "")}
              </div>
              <div style={{ fontSize: 20, marginBottom: 8 }}>
                {cls.emoji}
              </div>
              <div style={{ fontSize: 11, marginBottom: 6 }}>
                S{cls.stats.strength} C{cls.stats.charisma} R{cls.stats.creativity}
              </div>
              <div style={{ fontSize: 11, marginBottom: 4 }}>
                HP {cls.hp}
              </div>
              <div style={{ fontSize: 11, color: inverted ? "#333" : "#555" }}>
                G {cls.gold}
              </div>
              <div style={{ fontSize: 11, color: inverted ? "#555" : "#555", lineHeight: 1.5, marginTop: 8 }}>
                {cls.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Descend Button */}
      <button
        disabled={!canStart}
        onClick={() => selectedClass && onStart(selectedClass)}
        onMouseEnter={() => setHoveredStart(true)}
        onMouseLeave={() => setHoveredStart(false)}
        style={{
          border: `1px solid ${canStart ? (hoveredStart ? "#fff" : "#333") : "#1a1a1a"}`,
          background: "transparent",
          color: canStart ? (hoveredStart ? "#fff" : "#888") : "#333",
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 4,
          cursor: canStart ? "pointer" : "not-allowed",
          transition: "all 0.15s",
          fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          textTransform: "uppercase" as const,
        }}
      >
        DESCEND
      </button>
    </div>
  );
}
