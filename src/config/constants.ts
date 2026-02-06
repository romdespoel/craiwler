export const BIOMES: Record<number, { name: string; flavor: string }> = {
  1: { name: "Crumbling Halls", flavor: "Ruined architecture, traps, rats, bandits" },
  2: { name: "Crumbling Halls", flavor: "Ruined architecture, traps, rats, bandits" },
  3: { name: "Fungal Depths", flavor: "Bioluminescent forests, spore hazards, mycelial creatures" },
  4: { name: "Fungal Depths", flavor: "Bioluminescent forests, spore hazards, mycelial creatures" },
  5: { name: "Sunken Market", flavor: "Underground trading post, NPCs, social encounters, pickpockets" },
  6: { name: "Sunken Market", flavor: "Underground trading post, NPCs, social encounters, pickpockets" },
  7: { name: "Crystal Caverns", flavor: "Arcane anomalies, illusions, reality-bending puzzles" },
  8: { name: "Crystal Caverns", flavor: "Arcane anomalies, illusions, reality-bending puzzles" },
  9: { name: "The Marrow", flavor: "Organic, fleshy tunnels, horror-inflected, endgame enemies" },
  10: { name: "The Throne Below", flavor: "Boss floor. One extended encounter." },
};

export const DIFFICULTY_CURVE: Record<number, { avgDifficulty: string; hpDamageRange: string }> = {
  1: { avgDifficulty: "3-5", hpDamageRange: "1-2" },
  2: { avgDifficulty: "3-5", hpDamageRange: "1-2" },
  3: { avgDifficulty: "4-6", hpDamageRange: "2-3" },
  4: { avgDifficulty: "4-6", hpDamageRange: "2-3" },
  5: { avgDifficulty: "5-7", hpDamageRange: "2-4" },
  6: { avgDifficulty: "5-7", hpDamageRange: "2-4" },
  7: { avgDifficulty: "6-8", hpDamageRange: "3-5" },
  8: { avgDifficulty: "6-8", hpDamageRange: "3-5" },
  9: { avgDifficulty: "7-9", hpDamageRange: "4-6" },
  10: { avgDifficulty: "8-10", hpDamageRange: "5-8" },
};

export const ENCOUNTERS_PER_FLOOR: Record<number, number> = {
  1: 2, 2: 2, 3: 3, 4: 2, 5: 3, 6: 2, 7: 2, 8: 2, 9: 2, 10: 3,
};

export const LOADING_MESSAGES = [
  "The dungeon shifts around you...",
  "Fate weighs your choices...",
  "Shadows whisper of what's to come...",
  "The walls remember your passage...",
  "Something stirs in the darkness...",
  "The abyss gazes back...",
  "Ancient mechanisms groan to life...",
  "Your destiny is being woven...",
];

export const STAT_COLORS: Record<string, string> = {
  strength: "text-text",
  charisma: "text-text",
  creativity: "text-text",
  none: "text-muted",
};

export const STAT_BG_COLORS: Record<string, string> = {
  strength: "bg-cell",
  charisma: "bg-cell",
  creativity: "bg-cell",
  none: "bg-cell",
};

export const STAT_LABELS: Record<string, string> = {
  strength: "STR",
  charisma: "CHA",
  creativity: "CRE",
  none: "\u2014",
};

export const OUTCOME_STYLES: Record<string, { border: string; bg: string; label: string }> = {
  critical_success: { border: "border-l-white", bg: "bg-white/[0.03]", label: "Critical Success" },
  success: { border: "border-l-muted", bg: "bg-white/[0.02]", label: "Success" },
  partial: { border: "border-l-dim", bg: "bg-white/[0.01]", label: "Partial Success" },
  failure: { border: "border-l-wild", bg: "bg-wild/[0.05]", label: "Failure" },
};
