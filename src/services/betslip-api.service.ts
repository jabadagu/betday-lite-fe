import type { Bet } from "@/types/bet";
import { BetSelection } from "@/types/enums";

/**
 * Fetch all bets for the current user
 */
export const fetchBets = async (): Promise<Bet[]> => {
  const response = await fetch("/api/bets", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("FETCH_BETS_FAILED");
  }

  const data = (await response.json()) as { bets: Bet[] };
  return data.bets;
};

/**
 * Create a simple bet (single selection)
 */
export const postSimpleBet = async (
  eventId: string,
  selection: BetSelection,
  stake: number,
) => {
  const response = await fetch("/api/bets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "simple", eventId, selection, stake }),
  });
  if (!response.ok) throw new Error("POST_BET_FAILED");
  return response.json();
};

/**
 * Create a multiple bet (multiple selections combined)
 */
export const postMultipleBet = async (
  selections: Array<{ eventId: string; selection: BetSelection }>,
  stake: number,
) => {
  const response = await fetch("/api/bets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "multiple", selections, stake }),
  });
  if (!response.ok) throw new Error("POST_BET_FAILED");
  return response.json();
};
