import type { GameState } from "../types/game";
import { BIOMES, DIFFICULTY_CURVE, ENCOUNTERS_PER_FLOOR } from "../config/constants";

function buildPlayerContext(state: GameState): string {
  return `
PLAYER STATE:
- Class: ${state.playerClass?.name ?? "Unknown"}
- HP: ${state.hp}/${state.maxHp}
- Stats: STR ${state.stats.strength}, CHA ${state.stats.charisma}, CRE ${state.stats.creativity}
- Gold: ${state.gold}
- Inventory: ${state.inventory.length > 0 ? state.inventory.join(", ") : "Empty"}
- Reputation: ${Object.entries(state.reputation).map(([k, v]) => `${k}: ${v}`).join(", ") || "None established"}
- Active Effects: ${state.world.activeEffects.length > 0 ? state.world.activeEffects.join(", ") : "None"}
`.trim();
}

function buildWorldContext(state: GameState): string {
  const biome = BIOMES[state.world.floor] ?? { name: "Unknown", flavor: "" };
  return `
WORLD STATE:
- Floor: ${state.world.floor}/10
- Encounter: ${state.world.encounterOnFloor}/${ENCOUNTERS_PER_FLOOR[state.world.floor] ?? 2}
- Location: ${state.world.location || "Dungeon entrance"}
- Biome: ${biome.name} — ${biome.flavor}
- Entities: ${state.world.entities.length > 0 ? state.world.entities.map(e => `${e.name} (${e.type}): ${e.description}`).join("; ") : "None"}
- Objects: ${state.world.objects.length > 0 ? state.world.objects.join(", ") : "None"}
- Environment: ${state.world.environmentTags.length > 0 ? state.world.environmentTags.join(", ") : "None"}
- Flags: ${Object.keys(state.world.flags).length > 0 ? JSON.stringify(state.world.flags) : "None"}
`.trim();
}

function buildHistoryContext(state: GameState): string {
  if (state.history.length === 0) return "RECENT HISTORY: None (first turn)";
  const recent = state.history.slice(-6);
  return `RECENT HISTORY (last ${recent.length} turns):\n${recent
    .map(
      (t) =>
        `Turn ${t.turn} (Floor ${t.floor}): ${t.narration} → Player chose: "${t.choice}" → ${t.tier}: ${t.outcome}`
    )
    .join("\n")}`;
}

function buildDifficultyContext(floor: number): string {
  const curve = DIFFICULTY_CURVE[floor] ?? { avgDifficulty: "5-7", hpDamageRange: "2-4" };
  return `DIFFICULTY TARGET: Average difficulty ${curve.avgDifficulty}, HP damage range ${curve.hpDamageRange} for floor ${floor}.`;
}

const CORE_RULES = `
You are the narrator of Dungeon Craiwler, a dark fantasy text dungeon crawler. Your tone balances atmospheric dark fantasy with moments of absurdity and dark humor. You are NOT a friendly storyteller — you are a ruthless, creative dungeon master.

CRITICAL RULES:
1. You may ONLY reference entities, objects, and items that exist in the current world state or player inventory. If you want to introduce something new, add it to world_state_updates first. NEVER assume the player has items or abilities that aren't listed.
2. Do NOT protect the player from the consequences of bad decisions.
3. HP damage should be realistic. A direct hit from a large creature deals 3-5 damage. Falling into a pit deals 2-4. Poison deals 1 per turn.
4. If a player with low stats attempts a high difficulty check and fails, consequences should be severe.
5. Death is a valid and expected outcome. Do not contrive ways to save a doomed player.
6. Partial successes should always have real costs — not token scratches.
7. Enemy encounters should sometimes be unwinnable through combat alone.
8. Narration should be 2-3 sentences, vivid and atmospheric.
9. ALWAYS respond with valid JSON only. No markdown, no backticks, no explanation.

WILD OPTIONS:
- Exactly 1 of the 4 high-level options must be tagged wild: true.
- Wild options span a spectrum: ~40% high-risk/high-reward gambles, ~30% unconventional-but-clever solutions, ~20% reckless-but-stylish, ~10% traps that seem exciting but are actually the worst choice.
- Wild options are a real strategic axis, not comic relief.
`.trim();

export function buildOpeningPrompt(state: GameState): string {
  const biome = BIOMES[state.world.floor] ?? { name: "Crumbling Halls", flavor: "" };
  return `${CORE_RULES}

${buildPlayerContext(state)}
${buildDifficultyContext(state.world.floor)}

The player has just entered the dungeon as ${state.playerClass?.name}. Generate the opening scenario for Floor 1, Biome: ${biome.name} (${biome.flavor}).

Respond with this exact JSON structure:
{
  "narration": "2-3 vivid sentences setting the opening scene",
  "location": "descriptive location name",
  "biome": "${biome.name}",
  "entities": [{"name": "string", "type": "friendly|neutral|hostile", "description": "string"}],
  "objects": ["interactable objects in the scene"],
  "environment_tags": ["atmospheric tags like dark, damp, narrow"],
  "options": [
    {"id": 1, "label": "2-4 word intent", "emoji": "single emoji", "hint": "5-10 word hint", "wild": false},
    {"id": 2, "label": "...", "emoji": "...", "hint": "...", "wild": false},
    {"id": 3, "label": "...", "emoji": "...", "hint": "...", "wild": false},
    {"id": 4, "label": "...", "emoji": "...", "hint": "...", "wild": true}
  ]
}

Options must be meaningfully distinct. Exactly 1 must be wild. Options must be plausible given the world state.`;
}

export function buildSubOptionsPrompt(
  state: GameState,
  selectedOption: { label: string; hint: string; wild: boolean }
): string {
  return `${CORE_RULES}

${buildPlayerContext(state)}
${buildWorldContext(state)}
${buildDifficultyContext(state.world.floor)}

The player selected the high-level intent: "${selectedOption.label}" (${selectedOption.hint}).

Generate 4 specific sub-actions for this intent. Each sub-action should include a stat check type and difficulty.

Rules:
- Sub-options must be grounded in the world state. If the player has no weapon, reflect unarmed/improvised approaches.
- Exactly 1 sub-option must be wild: true — high risk, high reward. Wild sub-options should sometimes be secretly optimal.
- Stat checks are visible to the player, so difficulty ratings inform their risk assessment.
- Difficulty should generally be in the ${DIFFICULTY_CURVE[state.world.floor]?.avgDifficulty ?? "5-7"} range for normal options, 7-9 for wild options.

Respond with this exact JSON structure:
{
  "sub_options": [
    {"id": 1, "label": "concise action name", "description": "1 sentence describing what happens", "stat_check": "strength|charisma|creativity|none", "difficulty": 5, "wild": false},
    {"id": 2, "label": "...", "description": "...", "stat_check": "...", "difficulty": 5, "wild": false},
    {"id": 3, "label": "...", "description": "...", "stat_check": "...", "difficulty": 5, "wild": false},
    {"id": 4, "label": "...", "description": "...", "stat_check": "...", "difficulty": 8, "wild": true}
  ]
}`;
}

export function buildCustomInputPrompt(
  state: GameState,
  playerInput: string
): string {
  return `${CORE_RULES}

${buildPlayerContext(state)}
${buildWorldContext(state)}

The player typed a custom action: "${playerInput}"

Validate this action against the current world state:
1. If the action is POSSIBLE given the world state (entities, objects, items, environment) → set valid: true, interpret the action, and assign a stat check.
2. If the action is IMPOSSIBLE (references objects, allies, abilities that don't exist) → set valid: false and write a diegetic rejection narration. The narration should describe the failure in-fiction (e.g., "You reach for a sword, but your hands close on empty air."). This costs the player their turn.
3. If ambiguous → interpret generously but within world-state constraints.

Respond with this exact JSON structure:
{
  "valid": true,
  "interpretation": "how the AI reads the action",
  "stat_check": "strength|charisma|creativity|none",
  "difficulty": 5,
  "rejection_narration": null
}

If invalid:
{
  "valid": false,
  "interpretation": "what the player tried to do",
  "stat_check": "none",
  "difficulty": 0,
  "rejection_narration": "Diegetic narration of the failure. 1-2 sentences."
}`;
}

export function buildResolutionPrompt(
  state: GameState,
  action: string,
  successTier: string,
  statUsed: string,
  difficulty: number
): string {
  const maxEncounters = ENCOUNTERS_PER_FLOOR[state.world.floor] ?? 2;
  const isLastEncounter = state.world.encounterOnFloor >= maxEncounters;
  const floorAdvanceNote = isLastEncounter
    ? `This is the LAST encounter on floor ${state.world.floor}. After resolution, set floor_advance to true in world_state_updates to advance to floor ${state.world.floor + 1}. Generate a floor transition scene as the next_narration.`
    : `This is encounter ${state.world.encounterOnFloor} of ${maxEncounters} on this floor. Do NOT advance to the next floor.`;

  const isFloor10 = state.world.floor === 10;
  const bossNote = isFloor10
    ? "This is the BOSS FLOOR. The encounter should be climactic. If the player survives all encounters, they achieve victory."
    : "";

  return `${CORE_RULES}

${buildPlayerContext(state)}
${buildWorldContext(state)}
${buildHistoryContext(state)}
${buildDifficultyContext(state.world.floor)}

The player chose: "${action}"
Stat check: ${statUsed} (difficulty ${difficulty})
Result: ${successTier.toUpperCase()}

${floorAdvanceNote}
${bossNote}

DAMAGE GUIDELINES for floor ${state.world.floor}:
- HP damage range: ${DIFFICULTY_CURVE[state.world.floor]?.hpDamageRange ?? "2-4"}
- On FAILURE: deal damage in the upper range and impose negative consequences
- On PARTIAL: deal moderate damage or impose a complication
- On SUCCESS: minimal or no damage, positive outcome
- On CRITICAL SUCCESS: no damage, bonus rewards (extra loot, stat boost, story advantage)

Respond with this exact JSON structure:
{
  "outcome_narration": "2-3 sentences narrating the result of the action",
  "success_tier": "${successTier}",
  "stat_changes": {"strength": 0, "charisma": 0, "creativity": 0},
  "hp_change": 0,
  "max_hp_change": 0,
  "items_gained": [],
  "items_lost": [],
  "gold_change": 0,
  "reputation_changes": {},
  "world_state_updates": {
    "entities": [],
    "objects": [],
    "environment_tags": [],
    "flags": {},
    "floor_advance": false
  },
  "next_narration": "2-3 sentences setting up the NEXT situation",
  "next_location": "descriptive location name for next scene",
  "next_options": [
    {"id": 1, "label": "...", "emoji": "...", "hint": "...", "wild": false},
    {"id": 2, "label": "...", "emoji": "...", "hint": "...", "wild": false},
    {"id": 3, "label": "...", "emoji": "...", "hint": "...", "wild": false},
    {"id": 4, "label": "...", "emoji": "...", "hint": "...", "wild": true}
  ]
}

hp_change should be NEGATIVE for damage taken (e.g., -3). items_gained/items_lost are arrays of item name strings.
world_state_updates.entities replaces the current entity list for the next scene.
The next_options must be 4 meaningfully distinct options for the next situation, with exactly 1 wild.`;
}

export function buildLoadMorePrompt(
  state: GameState,
  existingLabels: string[]
): string {
  return `${CORE_RULES}

${buildPlayerContext(state)}
${buildWorldContext(state)}

The current situation already has these high-level options: ${existingLabels.join(", ")}

Generate 2 ADDITIONAL high-level options that are meaningfully distinct from the existing ones. At least one should offer an alternative approach not covered by the existing options.

Respond with this exact JSON structure:
{
  "options": [
    {"id": 5, "label": "2-4 word intent", "emoji": "single emoji", "hint": "5-10 word hint", "wild": false},
    {"id": 6, "label": "...", "emoji": "...", "hint": "...", "wild": false}
  ]
}`;
}
