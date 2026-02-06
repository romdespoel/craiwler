import { useState } from "react";

interface CustomInputProps {
  onSubmit: (input: string) => void;
  loading: boolean;
}

export default function CustomInput({ onSubmit, loading }: CustomInputProps) {
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0 || loading) return;
    onSubmit(trimmed);
    setValue("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <WriteYourOwnRow onClick={() => setExpanded(true)} />
    );
  }

  const charCount = value.length;
  const isOverLimit = charCount >= 180;

  return (
    <div style={{ marginTop: 12, marginLeft: 20, paddingLeft: 16, borderLeft: "2px solid #1a1a1a" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 200))}
        placeholder="Describe your action..."
        maxLength={200}
        autoFocus
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
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: isOverLimit ? "#ff3333" : "#333" }}>
          {charCount}/200
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <BackLink onClick={() => { setExpanded(false); setValue(""); }} />
          <button
            onClick={handleSubmit}
            disabled={value.trim().length === 0 || loading}
            style={{
              background: value.trim().length > 0 && !loading ? "#fff" : "#333",
              color: value.trim().length > 0 && !loading ? "#000" : "#555",
              fontWeight: 700,
              fontSize: 12,
              padding: "10px 16px",
              border: "none",
              cursor: value.trim().length > 0 && !loading ? "pointer" : "not-allowed",
              fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            }}
          >
            [ACT]
          </button>
        </div>
      </div>
    </div>
  );
}

function WriteYourOwnRow({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        marginLeft: 20,
        paddingLeft: 16,
        borderLeft: "2px solid #1a1a1a",
        background: "transparent",
        borderTop: "none",
        borderRight: "none",
        borderBottom: "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        marginTop: 4,
      }}
    >
      <div
        style={{
          background: "#0a0a0a",
          marginBottom: 1,
          padding: "12px 16px",
          borderLeft: "3px solid #1a1a1a",
          fontSize: 11,
          color: hovered ? "#888" : "#333",
          fontStyle: "italic",
          transition: "all 0.15s",
        }}
      >
        Write your own...
      </div>
    </button>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
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
      }}
    >
      ← back
    </button>
  );
}
