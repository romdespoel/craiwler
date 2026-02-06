import type { PlayerClass } from "../types/game";

export const CLASSES: PlayerClass[] = [
  {
    name: "The Fighter",
    emoji: "⚔️",
    description:
      "A battle-hardened warrior who solves problems with steel and sinew. High health, high strength, but not much for conversation or clever tricks.",
    stats: { strength: 7, charisma: 3, creativity: 3 },
    hp: 14,
    gold: 10,
    inventory: ["Rusty Longsword", "Leather Armor"],
  },
  {
    name: "The Merchant",
    emoji: "💰",
    description:
      "A silver-tongued trader who can talk their way out of anything — or buy their way through. Wealthy but fragile.",
    stats: { strength: 3, charisma: 7, creativity: 3 },
    hp: 8,
    gold: 50,
    inventory: ["Weighted Scales", "Pouch of Exotic Spices"],
  },
  {
    name: "The Artist",
    emoji: "🎨",
    description:
      "An eccentric creative with a knack for seeing what others miss. Frail and poor, but endlessly resourceful.",
    stats: { strength: 3, charisma: 3, creativity: 7 },
    hp: 8,
    gold: 5,
    inventory: ["Enchanted Paintbrush", "Journal of Sketches"],
  },
];
