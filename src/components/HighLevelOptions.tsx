import { useState } from "react";
import type { HighLevelOption } from "../types/game";

interface HighLevelOptionsProps {
  options: HighLevelOption[];
  selectedOption: HighLevelOption | null;
  onSelect: (option: HighLevelOption) => void;
  onLoadMore: () => void;
  loading: boolean;
  hasLoadedMore: boolean;
}

export default function HighLevelOptions({
  options,
  selectedOption,
  onSelect,
  onLoadMore,
  loading,
  hasLoadedMore,
}: HighLevelOptionsProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      {/* 2x2 Options Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "#1a1a1a",
        }}
      >
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          const isDimmed = selectedOption !== null && !isSelected;
          const isHovered = hovered === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              disabled={loading || isDimmed}
              onMouseEnter={() => setHovered(option.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isSelected || isHovered ? "#1a1a1a" : "#0a0a0a",
                padding: "18px 16px",
                cursor: isDimmed ? "default" : "pointer",
                borderLeft: `3px solid ${
                  isSelected
                    ? option.wild ? "#ff3333" : "#fff"
                    : option.wild
                    ? "#ff3333"
                    : isHovered
                    ? "#fff"
                    : "#222"
                }`,
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                textAlign: "left",
                transition: "all 0.15s",
                opacity: isDimmed ? 0.35 : 1,
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isSelected || isHovered
                      ? option.wild ? "#ff3333" : "#fff"
                      : option.wild ? "#ff3333" : "#aaa",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {option.label}
                </span>
                {option.wild && (
                  <span style={{ fontSize: 9, color: "#ff3333", fontWeight: 400, letterSpacing: 2 }}>
                    WILD
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>
                {option.hint}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Action Row / Load More */}
      {!hasLoadedMore && !selectedOption && (
        <CustomActionRow onClick={onLoadMore} loading={loading} />
      )}
    </div>
  );
}

function CustomActionRow({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        marginTop: 1,
        background: "#0a0a0a",
        padding: "10px 16px",
        borderLeft: "3px solid #222",
        borderTop: "none",
        borderRight: "none",
        borderBottom: "none",
        fontSize: 11,
        color: hovered ? "#888" : "#333",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      CUSTOM ACTION ▸
    </button>
  );
}
