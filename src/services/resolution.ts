export type SuccessTier = "critical_success" | "success" | "partial" | "failure";

export interface StatCheckResult {
  tier: SuccessTier;
  roll: number;
  effectiveScore: number;
  threshold: number;
}

/**
 * Perform a stat check using weighted randomness.
 *
 * effective_score = player_stat + roll (1-10)
 * threshold = difficulty + 5
 *
 * critical_success: effective_score >= threshold + 4
 * success:          effective_score >= threshold
 * partial:          effective_score >= threshold - 3
 * failure:          effective_score <  threshold - 3
 */
export function performStatCheck(
  playerStat: number,
  difficulty: number
): StatCheckResult {
  const roll = Math.floor(Math.random() * 10) + 1;
  const effectiveScore = playerStat + roll;
  const threshold = difficulty + 5;

  let tier: SuccessTier;
  if (effectiveScore >= threshold + 4) {
    tier = "critical_success";
  } else if (effectiveScore >= threshold) {
    tier = "success";
  } else if (effectiveScore >= threshold - 3) {
    tier = "partial";
  } else {
    tier = "failure";
  }

  return { tier, roll, effectiveScore, threshold };
}
