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

const TYPE_COLORS: Record<string, string> = {
  critical_success: "border-l-critical",
  death: "border-l-failure",
  wild_success: "border-l-wild",
  wild_failure: "border-l-wild",
  boss_encounter: "border-l-gold",
  major_loss: "border-l-partial",
  major_gain: "border-l-success",
  close_call: "border-l-partial",
  victory: "border-l-gold",
};

export default function HighlightReel({ highlights, grokApiKey }: HighlightReelProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<HighlightReelResult | null>(null);
  const [montageUrl, setMontageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full max-w-2xl">
      <h3 className="font-display text-sm text-parchment-dim tracking-widest mb-4 text-center">
        HIGHLIGHT REEL
      </h3>

      {/* Generated Images */}
      {result && result.images.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {result.images.map(({ highlight, imageUrl }, idx) => (
              <div
                key={`${highlight.turn}-${idx}`}
                className="relative rounded-lg overflow-hidden animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <img
                  src={imageUrl}
                  alt={`Turn ${highlight.turn} - ${highlight.type}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-abyss/80 backdrop-blur-sm px-3 py-2">
                  <div className="text-[10px] font-display text-gold tracking-wider">
                    {TYPE_LABELS[highlight.type] ?? highlight.type}
                  </div>
                  <div className="text-[9px] text-parchment-dim truncate">
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
              className="w-full py-3 font-display text-sm text-gold tracking-widest border border-gold rounded-lg hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              DOWNLOAD HIGHLIGHT REEL
            </button>
          )}
        </div>
      )}

      {/* Generate Button */}
      {!result && grokApiKey && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`w-full py-3 mb-6 font-display text-sm tracking-widest border rounded-lg transition-colors ${
            generating
              ? "border-gold-dim/30 text-gold-dim/50 cursor-not-allowed"
              : "border-gold text-gold hover:bg-gold/10"
          }`}
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              GENERATING IMAGE {progress.current}/{progress.total}
            </span>
          ) : (
            "GENERATE VISUAL HIGHLIGHT REEL"
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 border border-failure/50 bg-failure/10 rounded-lg text-sm text-parchment-dim">
          {error}
        </div>
      )}

      {/* Text Highlights */}
      <div className="space-y-3">
        {top.map((hl, idx) => (
          <div
            key={`${hl.turn}-${idx}`}
            className={`pl-4 border-l-2 ${
              TYPE_COLORS[hl.type] ?? "border-l-parchment-dim"
            } py-2 pr-3 rounded-r bg-abyss-light animate-fade-in`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-display text-gold tracking-wider">
                {TYPE_LABELS[hl.type] ?? hl.type}
              </span>
              <span className="text-[10px] font-display text-parchment-dim tracking-wider">
                Turn {hl.turn} — Floor {hl.floor}
              </span>
            </div>
            <p className="text-sm text-parchment/80 italic">{hl.narration}</p>
            <p className="text-xs text-parchment-dim mt-1">
              Action: <span className="text-gold">{hl.choice}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
