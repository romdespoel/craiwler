import { useState } from "react";
import type { SubOption } from "../types/game";
import { STAT_LABELS } from "../config/constants";

interface SubOptionsProps {
  subOptions: SubOption[];
  onSelect: (subOption: SubOption) => void;
  loading: boolean;
}

export default function SubOptions({ subOptions, onSelect, loading }: SubOptionsProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        marginLeft: 20,
        borderLeft: "2px solid #1a1a1a",
        paddingLeft: 16,
        marginTop: 12,
      }}
    >
      {subOptions.map((sub) => {
        const isHovered = hovered === sub.id;
        const statLabel = STAT_LABELS[sub.stat_check] ?? "\u2014";

        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub)}
            disabled={loading}
            onMouseEnter={() => setHovered(sub.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: "100%",
              background: isHovered ? "#1a1a1a" : "#0a0a0a",
              marginBottom: 1,
              padding: "12px 16px",
              borderLeft: `3px solid ${
                sub.wild
                  ? "#ff3333"
                  : isHovered
                  ? "#fff"
                  : "#222"
              }`,
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              cursor: loading ? "not-allowed" : "pointer",
              textAlign: "left",
              transition: "all 0.15s",
              opacity: loading ? 0.5 : 1,
              fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: sub.wild ? "#ff3333" : isHovered ? "#fff" : "#e0e0e0",
                  }}
                >
                  {sub.label}
                </span>
                {sub.wild && (
                  <span style={{ fontSize: 9, color: "#ff3333", fontWeight: 400, letterSpacing: 2 }}>
                    WILD
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#555" }}>
                {sub.description}
              </div>
            </div>

            {/* Stat check badge */}
            {sub.stat_check !== "none" && (
              <span
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  padding: "2px 6px",
                  fontSize: 10,
                  color: "#333",
                  whiteSpace: "nowrap",
                  marginLeft: 12,
                }}
              >
                {statLabel}:{sub.difficulty}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
