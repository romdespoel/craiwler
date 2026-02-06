import { useReducer, useCallback } from "react";
import type {
  GameState,
  GameAction,
  PlayerClass,
  HighLevelOption,
  SubOption,
  Highlight,
} from "../types/game";
import {
  generateOpeningScenario,
  generateSubOptions,
  validateCustomInput,
  resolveAction,
  loadMoreOptions,
} from "../services/ai";
import { performStatCheck } from "../services/resolution";
import { LOADING_MESSAGES, BIOMES, ENCOUNTERS_PER_FLOOR } from "../config/constants";

function randomLoadingMessage(): string {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}

const INITIAL_STATE: GameState = {
  phase: "title",
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || "",
  grokApiKey: import.meta.env.VITE_GROK_API_KEY || "",
  playerClass: null,
  stats: { strength: 3, charisma: 3, creativity: 3 },
  hp: 10,
  maxHp: 10,
  gold: 0,
  inventory: [],
  reputation: {},
  world: {
    floor: 1,
    encounterOnFloor: 1,
    location: "",
    biome: "Crumbling Halls",
    entities: [],
    objects: [],
    environmentTags: [],
    activeEffects: [],
    flags: {},
  },
  turnCount: 0,
  history: [],
  highlights: [],
  currentNarration: "",
  currentOptions: [],
  selectedOption: null,
  currentSubOptions: null,
  lastOutcome: null,
  loading: false,
  loadingMessage: "",
  error: null,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_API_KEY":
      return { ...state, apiKey: action.apiKey };

    case "SET_GROK_API_KEY":
      return { ...state, grokApiKey: action.grokApiKey };

    case "SELECT_CLASS": {
      const pc = action.playerClass;
      return {
        ...state,
        playerClass: pc,
        stats: { ...pc.stats },
        hp: pc.hp,
        maxHp: pc.hp,
        gold: pc.gold,
        inventory: [...pc.inventory],
        phase: "playing",
      };
    }

    case "SET_OPENING_SCENARIO": {
      const r = action.response;
      return {
        ...state,
        currentNarration: r.narration,
        currentOptions: r.options,
        world: {
          ...state.world,
          location: r.location,
          biome: r.biome,
          entities: r.entities,
          objects: r.objects,
          environmentTags: r.environment_tags,
        },
        loading: false,
        error: null,
      };
    }

    case "SELECT_OPTION":
      return {
        ...state,
        selectedOption: action.option,
        currentSubOptions: null,
      };

    case "SET_SUB_OPTIONS":
      return {
        ...state,
        currentSubOptions: action.subOptions,
        loading: false,
      };

    case "ADD_MORE_OPTIONS":
      return {
        ...state,
        currentOptions: [...state.currentOptions, ...action.options],
        loading: false,
      };

    case "RESOLVE_ACTION": {
      const r = action.response;
      const newStats = {
        strength: clamp(state.stats.strength + (r.stat_changes?.strength ?? 0), 1, 10),
        charisma: clamp(state.stats.charisma + (r.stat_changes?.charisma ?? 0), 1, 10),
        creativity: clamp(state.stats.creativity + (r.stat_changes?.creativity ?? 0), 1, 10),
      };
      const newMaxHp = state.maxHp + (r.max_hp_change ?? 0);
      const newHp = clamp(state.hp + (r.hp_change ?? 0), 0, newMaxHp);
      const newGold = Math.max(0, state.gold + (r.gold_change ?? 0));

      let newInventory = [...state.inventory];
      if (r.items_gained) newInventory.push(...r.items_gained);
      if (r.items_lost) {
        newInventory = newInventory.filter(
          (item) => !r.items_lost.includes(item)
        );
      }

      const newReputation = { ...state.reputation };
      if (r.reputation_changes) {
        for (const [k, v] of Object.entries(r.reputation_changes)) {
          newReputation[k] = clamp((newReputation[k] ?? 0) + v, -3, 3);
        }
      }

      const wu = r.world_state_updates ?? {};
      const newFloor = wu.floor_advance ? state.world.floor + 1 : state.world.floor;
      const newEncounter = wu.floor_advance ? 1 : state.world.encounterOnFloor + 1;
      const biome = BIOMES[newFloor]?.name ?? state.world.biome;

      const newWorld = {
        ...state.world,
        floor: newFloor,
        encounterOnFloor: newEncounter,
        location: r.next_location || state.world.location,
        biome,
        entities: wu.entities ?? [],
        objects: wu.objects ?? state.world.objects,
        environmentTags: wu.environment_tags ?? state.world.environmentTags,
        flags: { ...state.world.flags, ...(wu.flags ?? {}) },
      };

      const turnSummary = {
        turn: state.turnCount + 1,
        floor: state.world.floor,
        narration: state.currentNarration,
        choice: action.choice,
        outcome: r.outcome_narration,
        tier: r.success_tier,
      };

      // Track highlights
      const newHighlights = [...state.highlights];
      const hl: Partial<Highlight> = {
        turn: state.turnCount + 1,
        floor: state.world.floor,
        narration: r.outcome_narration,
        choice: action.choice,
      };

      if (r.success_tier === "critical_success") {
        newHighlights.push({ ...hl, type: "critical_success", dramaticWeight: 8 } as Highlight);
      }
      if (action.wasWild && (r.success_tier === "critical_success" || r.success_tier === "success")) {
        newHighlights.push({ ...hl, type: "wild_success", dramaticWeight: 9 } as Highlight);
      }
      if (action.wasWild && (r.success_tier === "failure")) {
        newHighlights.push({ ...hl, type: "wild_failure", dramaticWeight: 7 } as Highlight);
      }
      if (newHp <= 2 && newHp > 0) {
        newHighlights.push({ ...hl, type: "close_call", dramaticWeight: 7 } as Highlight);
      }
      if (r.items_gained && r.items_gained.length > 0) {
        newHighlights.push({ ...hl, type: "major_gain", dramaticWeight: 5 } as Highlight);
      }
      if (r.items_lost && r.items_lost.length > 0) {
        newHighlights.push({ ...hl, type: "major_loss", dramaticWeight: 6 } as Highlight);
      }

      // Check win/death
      let newPhase = state.phase;
      if (newHp <= 0) {
        newPhase = "dead";
        newHighlights.push({
          turn: state.turnCount + 1,
          floor: state.world.floor,
          narration: r.outcome_narration,
          choice: action.choice,
          type: "death",
          dramaticWeight: 10,
        });
      } else if (newFloor > 10) {
        newPhase = "victory";
        newHighlights.push({
          turn: state.turnCount + 1,
          floor: state.world.floor,
          narration: r.outcome_narration,
          choice: action.choice,
          type: "victory",
          dramaticWeight: 10,
        });
      } else if (
        newFloor === 10 &&
        newEncounter > (ENCOUNTERS_PER_FLOOR[10] ?? 3)
      ) {
        newPhase = "victory";
        newHighlights.push({
          turn: state.turnCount + 1,
          floor: 10,
          narration: r.outcome_narration,
          choice: action.choice,
          type: "victory",
          dramaticWeight: 10,
        });
      }

      return {
        ...state,
        phase: newPhase,
        stats: newStats,
        hp: newHp,
        maxHp: newMaxHp,
        gold: newGold,
        inventory: newInventory,
        reputation: newReputation,
        world: newWorld,
        turnCount: state.turnCount + 1,
        history: [...state.history, turnSummary],
        highlights: newHighlights,
        currentNarration: r.next_narration,
        currentOptions: r.next_options ?? [],
        selectedOption: null,
        currentSubOptions: null,
        lastOutcome: {
          narration: r.outcome_narration,
          tier: r.success_tier,
          choice: action.choice,
        },
        loading: false,
        error: null,
      };
    }

    case "CUSTOM_INPUT_REJECTED":
      return {
        ...state,
        turnCount: state.turnCount + 1,
        lastOutcome: {
          narration: action.narration,
          tier: "failure",
          choice: "Custom action (rejected)",
        },
        selectedOption: null,
        currentSubOptions: null,
        loading: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
        loadingMessage: action.message ?? randomLoadingMessage(),
        error: action.loading ? null : state.error,
      };

    case "SET_ERROR":
      return { ...state, error: action.error, loading: false };

    case "CLEAR_SELECTION":
      return { ...state, selectedOption: null, currentSubOptions: null };

    case "RESET_GAME":
      return { ...INITIAL_STATE, apiKey: state.apiKey, grokApiKey: state.grokApiKey };

    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  const setApiKey = useCallback((apiKey: string) => {
    dispatch({ type: "SET_API_KEY", apiKey });
  }, []);

  const setGrokApiKey = useCallback((grokApiKey: string) => {
    dispatch({ type: "SET_GROK_API_KEY", grokApiKey });
  }, []);

  const startGame = useCallback(
    async (playerClass: PlayerClass) => {
      dispatch({ type: "SELECT_CLASS", playerClass });
      dispatch({ type: "SET_LOADING", loading: true, message: "The dungeon awaits..." });

      // Build a temporary state with the class selected to pass to the API
      const tempState: GameState = {
        ...INITIAL_STATE,
        apiKey: state.apiKey,
        playerClass,
        stats: { ...playerClass.stats },
        hp: playerClass.hp,
        maxHp: playerClass.hp,
        gold: playerClass.gold,
        inventory: [...playerClass.inventory],
        phase: "playing",
      };

      try {
        const response = await generateOpeningScenario(tempState);
        dispatch({ type: "SET_OPENING_SCENARIO", response });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: `The weave of fate tangles... ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    },
    [state.apiKey]
  );

  const selectOption = useCallback(
    async (option: HighLevelOption) => {
      dispatch({ type: "SELECT_OPTION", option });
      dispatch({ type: "SET_LOADING", loading: true });

      try {
        const response = await generateSubOptions(state, {
          label: option.label,
          hint: option.hint,
          wild: option.wild,
        });
        dispatch({ type: "SET_SUB_OPTIONS", subOptions: response.sub_options });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: `The weave of fate tangles... ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    },
    [state]
  );

  const selectSubOption = useCallback(
    async (subOption: SubOption) => {
      dispatch({ type: "SET_LOADING", loading: true, message: "Fate weighs your choices..." });

      try {
        let tier = "success";
        if (subOption.stat_check !== "none") {
          const statValue = state.stats[subOption.stat_check as keyof typeof state.stats];
          const result = performStatCheck(statValue, subOption.difficulty);
          tier = result.tier;
        }

        const response = await resolveAction(
          state,
          subOption.label,
          tier,
          subOption.stat_check,
          subOption.difficulty
        );

        const wasWild = subOption.wild || (state.selectedOption?.wild ?? false);
        dispatch({ type: "RESOLVE_ACTION", response, choice: subOption.label, wasWild });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: `The weave of fate tangles... ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    },
    [state]
  );

  const submitCustomInput = useCallback(
    async (input: string) => {
      dispatch({ type: "SET_LOADING", loading: true });

      try {
        const validation = await validateCustomInput(state, input);

        if (!validation.valid) {
          dispatch({
            type: "CUSTOM_INPUT_REJECTED",
            narration: validation.rejection_narration ?? "Your action fails to find purchase in reality.",
          });
          return;
        }

        dispatch({
          type: "SET_LOADING",
          loading: true,
          message: "Fate weighs your choices...",
        });

        let tier = "success";
        if (validation.stat_check !== "none") {
          const statValue =
            state.stats[validation.stat_check as keyof typeof state.stats];
          const result = performStatCheck(statValue, validation.difficulty);
          tier = result.tier;
        }

        const response = await resolveAction(
          state,
          validation.interpretation,
          tier,
          validation.stat_check,
          validation.difficulty
        );

        dispatch({
          type: "RESOLVE_ACTION",
          response,
          choice: input,
          wasWild: false,
        });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: `The weave of fate tangles... ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    },
    [state]
  );

  const loadMore = useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const existingLabels = state.currentOptions.map((o) => o.label);
      const response = await loadMoreOptions(state, existingLabels);
      dispatch({ type: "ADD_MORE_OPTIONS", options: response.options });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: `The weave of fate tangles... ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }
  }, [state]);

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const retryAfterError = useCallback(() => {
    dispatch({ type: "SET_ERROR", error: null });
  }, []);

  return {
    state,
    setApiKey,
    setGrokApiKey,
    startGame,
    selectOption,
    selectSubOption,
    submitCustomInput,
    loadMore,
    clearSelection,
    resetGame,
    retryAfterError,
  };
}
