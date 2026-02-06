// ─── Entity ────────────────────────────────────────────────
export interface Entity {
  name: string;
  type: "friendly" | "neutral" | "hostile";
  description: string;
}

// ─── Options ───────────────────────────────────────────────
export interface HighLevelOption {
  id: number;
  label: string;
  emoji: string;
  hint: string;
  wild: boolean;
}

export interface SubOption {
  id: number;
  label: string;
  description: string;
  stat_check: "strength" | "charisma" | "creativity" | "none";
  difficulty: number;
  wild: boolean;
}

// ─── AI Response Schemas ───────────────────────────────────
export interface OpeningScenarioResponse {
  narration: string;
  location: string;
  biome: string;
  entities: Entity[];
  objects: string[];
  environment_tags: string[];
  options: HighLevelOption[];
}

export interface SubOptionResponse {
  sub_options: SubOption[];
}

export interface CustomInputValidation {
  valid: boolean;
  interpretation: string;
  stat_check: "strength" | "charisma" | "creativity" | "none";
  difficulty: number;
  rejection_narration: string | null;
}

export interface ActionResolutionResponse {
  outcome_narration: string;
  success_tier: "critical_success" | "success" | "partial" | "failure";
  stat_changes: { strength: number; charisma: number; creativity: number };
  hp_change: number;
  max_hp_change: number;
  items_gained: string[];
  items_lost: string[];
  gold_change: number;
  reputation_changes: Record<string, number>;
  world_state_updates: {
    entities: Entity[];
    objects: string[];
    environment_tags: string[];
    flags: Record<string, unknown>;
    floor_advance: boolean;
  };
  next_narration: string;
  next_location: string;
  next_options: HighLevelOption[];
}

export interface FloorTransitionResponse {
  narration: string;
  location: string;
  biome: string;
  entities: Entity[];
  objects: string[];
  environment_tags: string[];
  options: HighLevelOption[];
}

// ─── Highlights ────────────────────────────────────────────
export type HighlightType =
  | "critical_success"
  | "death"
  | "wild_success"
  | "wild_failure"
  | "boss_encounter"
  | "major_loss"
  | "major_gain"
  | "close_call"
  | "victory";

export interface Highlight {
  turn: number;
  floor: number;
  narration: string;
  choice: string;
  type: HighlightType;
  dramaticWeight: number;
}

// ─── Player Class ──────────────────────────────────────────
export interface PlayerClass {
  name: string;
  emoji: string;
  description: string;
  stats: { strength: number; charisma: number; creativity: number };
  hp: number;
  gold: number;
  inventory: string[];
}

// ─── World State ───────────────────────────────────────────
export interface WorldState {
  floor: number;
  encounterOnFloor: number;
  location: string;
  biome: string;
  entities: Entity[];
  objects: string[];
  environmentTags: string[];
  activeEffects: string[];
  flags: Record<string, unknown>;
}

// ─── Game State ────────────────────────────────────────────
export type GamePhase = "title" | "playing" | "dead" | "victory";

export interface GameState {
  phase: GamePhase;
  apiKey: string;

  // Player
  playerClass: PlayerClass | null;
  stats: { strength: number; charisma: number; creativity: number };
  hp: number;
  maxHp: number;
  gold: number;
  inventory: string[];
  reputation: Record<string, number>;

  // World
  world: WorldState;

  // Turn state
  turnCount: number;
  history: TurnSummary[];
  highlights: Highlight[];

  // Current turn
  currentNarration: string;
  currentOptions: HighLevelOption[];
  selectedOption: HighLevelOption | null;
  currentSubOptions: SubOption[] | null;
  lastOutcome: {
    narration: string;
    tier: "critical_success" | "success" | "partial" | "failure";
    choice: string;
  } | null;

  // Loading
  loading: boolean;
  loadingMessage: string;

  // Error
  error: string | null;
}

export interface TurnSummary {
  turn: number;
  floor: number;
  narration: string;
  choice: string;
  outcome: string;
  tier: string;
}

// ─── Game Actions ──────────────────────────────────────────
export type GameAction =
  | { type: "SET_API_KEY"; apiKey: string }
  | { type: "SELECT_CLASS"; playerClass: PlayerClass }
  | { type: "SET_OPENING_SCENARIO"; response: OpeningScenarioResponse }
  | { type: "SELECT_OPTION"; option: HighLevelOption }
  | { type: "SET_SUB_OPTIONS"; subOptions: SubOption[] }
  | { type: "ADD_MORE_OPTIONS"; options: HighLevelOption[] }
  | { type: "RESOLVE_ACTION"; response: ActionResolutionResponse; choice: string; wasWild: boolean }
  | { type: "CUSTOM_INPUT_REJECTED"; narration: string }
  | { type: "FLOOR_TRANSITION"; response: FloorTransitionResponse }
  | { type: "SET_LOADING"; loading: boolean; message?: string }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET_GAME" }
  | { type: "CLEAR_SELECTION" };
