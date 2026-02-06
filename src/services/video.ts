import type { Highlight } from "../types/game";

const GROK_API_URL = "https://api.x.ai/v1/images/generations";

const TYPE_SCENE_HINTS: Record<string, string> = {
  critical_success: "triumphant moment, golden light, hero achieving victory",
  death: "dramatic death scene, darkness closing in, fallen hero",
  wild_success: "chaotic success, unexpected triumph, wild energy",
  wild_failure: "catastrophic failure, things going wrong, dramatic disaster",
  boss_encounter: "epic boss battle, towering enemy, intense confrontation",
  major_loss: "moment of loss, somber atmosphere, valuable item fading",
  major_gain: "treasure discovery, glowing artifact, moment of fortune",
  close_call: "narrow escape, barely surviving, tension and relief",
  victory: "glorious victory, throne room, triumphant hero crowned in light",
};

/**
 * Compress a highlight into a cinematic image prompt
 */
function buildScenePrompt(highlight: Highlight): string {
  const sceneHint = TYPE_SCENE_HINTS[highlight.type] ?? "dramatic dungeon scene";

  return `Dark fantasy dungeon scene, ${sceneHint}. ${highlight.narration.slice(0, 100)}. Action: ${highlight.choice}. Cinematic lighting, atmospheric, painted fantasy art style, dramatic composition, dark color palette with golden accents.`;
}

/**
 * Generate an image for a single highlight using Grok API
 */
async function generateHighlightImage(
  highlight: Highlight,
  grokApiKey: string
): Promise<string> {
  const prompt = buildScenePrompt(highlight);

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${grokApiKey}`,
    },
    body: JSON.stringify({
      model: "grok-2-image",
      prompt,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Grok API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data in Grok response");

  return `data:image/png;base64,${b64}`;
}

export interface HighlightReelResult {
  images: Array<{
    highlight: Highlight;
    imageUrl: string;
  }>;
}

/**
 * Generate images for the top highlights
 */
export async function generateHighlightReel(
  highlights: Highlight[],
  grokApiKey: string,
  onProgress?: (current: number, total: number) => void
): Promise<HighlightReelResult> {
  // Select top 4 highlights by dramatic weight, deduplicated by turn
  const seen = new Set<number>();
  const top = highlights
    .sort((a, b) => b.dramaticWeight - a.dramaticWeight)
    .filter((h) => {
      if (seen.has(h.turn)) return false;
      seen.add(h.turn);
      return true;
    })
    .slice(0, 4)
    .sort((a, b) => a.turn - b.turn);

  const results: HighlightReelResult["images"] = [];

  for (let i = 0; i < top.length; i++) {
    onProgress?.(i + 1, top.length);
    const highlight = top[i];
    try {
      const imageUrl = await generateHighlightImage(highlight, grokApiKey);
      results.push({ highlight, imageUrl });
    } catch (err) {
      console.error(`Failed to generate image for highlight ${i}:`, err);
      // Continue with other highlights
    }
  }

  return { images: results };
}

/**
 * Create a downloadable montage from highlight images
 * Returns a data URL for a combined image
 */
export async function createDownloadableMontage(
  images: HighlightReelResult["images"]
): Promise<string> {
  if (images.length === 0) {
    throw new Error("No images to create montage");
  }

  // Load all images
  const loadedImages = await Promise.all(
    images.map(
      ({ imageUrl }) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imageUrl;
        })
    )
  );

  // Create canvas for 2x2 grid (or 1x4 if only 1-2 images)
  const cols = images.length <= 2 ? images.length : 2;
  const rows = Math.ceil(images.length / cols);
  const cellWidth = 512;
  const cellHeight = 512;
  const padding = 8;
  const headerHeight = 60;

  const canvas = document.createElement("canvas");
  canvas.width = cols * cellWidth + (cols + 1) * padding;
  canvas.height = rows * cellHeight + (rows + 1) * padding + headerHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Fill background
  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw title
  ctx.fillStyle = "#c9a84c";
  ctx.font = "bold 28px Cinzel, serif";
  ctx.textAlign = "center";
  ctx.fillText("DUNGEON CRAIWLER", canvas.width / 2, 40);

  // Draw images in grid
  loadedImages.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (cellWidth + padding);
    const y = headerHeight + padding + row * (cellHeight + padding);

    ctx.drawImage(img, x, y, cellWidth, cellHeight);

    // Draw highlight type label
    const highlight = images[i].highlight;
    ctx.fillStyle = "rgba(8, 8, 15, 0.7)";
    ctx.fillRect(x, y + cellHeight - 30, cellWidth, 30);
    ctx.fillStyle = "#d4c8b0";
    ctx.font = "14px Crimson Text, serif";
    ctx.textAlign = "left";
    ctx.fillText(
      `Turn ${highlight.turn} - ${highlight.type.replace(/_/g, " ")}`,
      x + 8,
      y + cellHeight - 10
    );
  });

  return canvas.toDataURL("image/png");
}

/**
 * Download the montage as a file
 */
export function downloadMontage(dataUrl: string, filename: string = "dungeon-craiwler-highlights.png") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
