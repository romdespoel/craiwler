import { useState } from "react";
import type { Highlight } from "../types/game";
import {
  generateHighlightReel,
  createDownloadableMontage,
  downloadMontage,
  type HighlightReelResult,
} from "../services/video";

interface HighlightReelProps {
  highlights: Highlight[];
  grokApiKey: string;
}

const TYPE_LABELS: Record<string, string> = {
  critical_success: "Critical Success",
  death: "Final Moment",
  wild_success: "Wild Gambit Pays Off",
  wild_failure: "Wild Gambit Backfires",
  boss_encounter: "Boss Encounter",
  major_loss: "A Bitter Loss",
  major_gain: "A Lucky Find",
  close_call: "A Narrow Escape",
  victory: "Victory",
};

// Monochrome border system — only red for death/wild_failure/failure-related
const TYPE_BORDER_COLORS: Record<string, string> = {
  critical_success: "#ffffff",
  death: "#ff3333",
  wild_success: "#888",
  wild_failure: "#ff3333",
  boss_encounter: "#888",
  major_loss: "#555",
  major_gain: "#888",
  close_call: "#555",
  victory: "#ffffff",
};

export default function HighlightReel({ highlights, grokApiKey }: HighlightReelProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<HighlightReelResult | null>(null);
  const [montageUrl, setMontageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Select top 5 highlights by dramatic weight, deduplicated by turn
  const seen = new Set<number>();
  const top = highlights
    .sort((a, b) => b.dramaticWeight - a.dramaticWeight)
    .filter((h) => {
      if (seen.has(h.turn)) return false;
      seen.add(h.turn);
      return true;
    })
    .slice(0, 5)
    .sort((a, b) => a.turn - b.turn);

  if (top.length === 0) return null;

  const handleGenerate = async () => {
    if (!grokApiKey) {
      setError("Grok API key is required for video generation");
      return;
    }

    setGenerating(true);
    setError(null);
    setProgress({ current: 0, total: top.length });

    try {
      const reelResult = await generateHighlightReel(
        highlights,
        grokApiKey,
        (current, total) => setProgress({ current, total })
      );
      setResult(reelResult);

      if (reelResult.images.length > 0) {
        const montage = await createDownloadableMontage(reelResult.images);
        setMontageUrl(montage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate highlight reel");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (montageUrl) {
      downloadMontage(montageUrl);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 580 }}>
      <h3 style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 16, textAlign: "center", textTransform: "uppercase" as const }}>
        HIGHLIGHT REEL
      </h3>

      {/* Generated Images */}
      {result && result.images.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1a1a1a", marginBottom: 16 }}>
            {result.images.map(({ highlight, imageUrl }, idx) => (
              <div
                key={`${highlight.turn}-${idx}`}
                className="animate-fade-in"
                style={{ position: "relative", animationDelay: `${idx * 150}ms` }}
              >
                <img
                  src={imageUrl}
                  alt={`Turn ${highlight.turn} - ${highlight.type}`}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.8)",
                  padding: "8px 10px",
                }}>
                  <div style={{ fontSize: 9, color: "#888", letterSpacing: 1 }}>
                    {TYPE_LABELS[highlight.type] ?? highlight.type}
                  </div>
                  <div style={{ fontSize: 9, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Turn {highlight.turn} — {highlight.choice}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Download Button */}
          {montageUrl && (
            <button
              onClick={handleDownload}
              onMouseEnter={() => setHoveredButton("download")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                border: `1px solid ${hoveredButton === "download" ? "#fff" : "#333"}`,
                background: "transparent",
                color: hoveredButton === "download" ? "#fff" : "#888",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                textTransform: "uppercase" as const,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span>↓</span> DOWNLOAD HIGHLIGHT REEL
            </button>
          )}
        </div>
      )}

      {/* Generate Button */}
      {!result && grokApiKey && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          onMouseEnter={() => setHoveredButton("generate")}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: 24,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            border: `1px solid ${generating ? "#1a1a1a" : hoveredButton === "generate" ? "#fff" : "#333"}`,
            background: "transparent",
            color: generating ? "#333" : hoveredButton === "generate" ? "#fff" : "#888",
            cursor: generating ? "not-allowed" : "pointer",
            transition: "all 0.15s",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            textTransform: "uppercase" as const,
          }}
        >
          {generating ? (
            <span>GENERATING IMAGE {progress.current}/{progress.total}...</span>
          ) : (
            "GENERATE VISUAL HIGHLIGHT REEL"
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          border: "1px solid rgba(255, 51, 51, 0.3)",
          background: "rgba(255, 51, 51, 0.05)",
          fontSize: 12,
          color: "#888",
        }}>
          {error}
        </div>
      )}

      {/* Text Highlights */}
      <div>
        {top.map((hl, idx) => (
          <div
            key={`${hl.turn}-${idx}`}
            className="animate-fade-in"
            style={{
              borderLeft: `3px solid ${TYPE_BORDER_COLORS[hl.type] ?? "#333"}`,
              padding: "10px 14px",
              marginBottom: 1,
              background: "#0a0a0a",
              animationDelay: `${idx * 150}ms`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>
                {TYPE_LABELS[hl.type] ?? hl.type}
              </span>
              <span style={{ fontSize: 10, color: "#333", letterSpacing: 1 }}>
                Turn {hl.turn} — Floor {hl.floor}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{hl.narration}</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
              ▸ {hl.choice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
