import type {
  GameState,
  OpeningScenarioResponse,
  SubOptionResponse,
  CustomInputValidation,
  ActionResolutionResponse,
  HighLevelOption,
} from "../types/game";
import {
  buildOpeningPrompt,
  buildSubOptionsPrompt,
  buildCustomInputPrompt,
  buildResolutionPrompt,
  buildLoadMorePrompt,
} from "./prompts";

const API_URL = "https://api.anthropic.com/v1/messages";

interface ApiCallOptions {
  model: "haiku" | "sonnet";
  systemPrompt: string;
  userMessage: string;
  apiKey: string;
}

const MODEL_MAP = {
  haiku: "claude-3-5-haiku-20241022",
  sonnet: "claude-sonnet-4-20250514",
};

function parseJsonResponse<T>(text: string): T {
  // Strip markdown fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned) as T;
}

async function callApi<T>({ model, systemPrompt, userMessage, apiKey }: ApiCallOptions): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL_MAP[model],
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Empty API response");

  return parseJsonResponse<T>(text);
}

// ─── Public API ────────────────────────────────────────────

export async function generateOpeningScenario(
  state: GameState
): Promise<OpeningScenarioResponse> {
  const prompt = buildOpeningPrompt(state);
  return callApi<OpeningScenarioResponse>({
    model: "sonnet",
    systemPrompt: prompt,
    userMessage: `Generate the opening scenario for ${state.playerClass?.name}. Respond ONLY with valid JSON.`,
    apiKey: state.apiKey,
  });
}

export async function generateSubOptions(
  state: GameState,
  selectedOption: { label: string; hint: string; wild: boolean }
): Promise<SubOptionResponse> {
  const prompt = buildSubOptionsPrompt(state, selectedOption);
  return callApi<SubOptionResponse>({
    model: "haiku",
    systemPrompt: prompt,
    userMessage: `Generate 4 sub-options for the intent "${selectedOption.label}". Respond ONLY with valid JSON.`,
    apiKey: state.apiKey,
  });
}

export async function validateCustomInput(
  state: GameState,
  playerInput: string
): Promise<CustomInputValidation> {
  const prompt = buildCustomInputPrompt(state, playerInput);
  return callApi<CustomInputValidation>({
    model: "haiku",
    systemPrompt: prompt,
    userMessage: `Validate this custom action: "${playerInput}". Respond ONLY with valid JSON.`,
    apiKey: state.apiKey,
  });
}

export async function resolveAction(
  state: GameState,
  action: string,
  successTier: string,
  statUsed: string,
  difficulty: number
): Promise<ActionResolutionResponse> {
  const prompt = buildResolutionPrompt(state, action, successTier, statUsed, difficulty);
  return callApi<ActionResolutionResponse>({
    model: "sonnet",
    systemPrompt: prompt,
    userMessage: `Resolve the action "${action}" with result ${successTier}. Respond ONLY with valid JSON.`,
    apiKey: state.apiKey,
  });
}

export async function loadMoreOptions(
  state: GameState,
  existingLabels: string[]
): Promise<{ options: HighLevelOption[] }> {
  const prompt = buildLoadMorePrompt(state, existingLabels);
  return callApi<{ options: HighLevelOption[] }>({
    model: "haiku",
    systemPrompt: prompt,
    userMessage: `Generate 2 more high-level options. Respond ONLY with valid JSON.`,
    apiKey: state.apiKey,
  });
}
