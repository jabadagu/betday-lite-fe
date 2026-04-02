import "server-only";

import { randomUUID } from "crypto";

import { eventById } from "@/data/mock-events";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Bet, BetLeg } from "@/types/bet";
import { BetSelection } from "@/types/enums";
import { BetStatus, BetType } from "@/types/enums";

type BetRow = {
  id: string;
  user_id: string;
  type: Bet["type"];
  legs: BetLeg[];
  stake: number | string;
  total_odd: number | string;
  potential_win: number | string;
  status: Bet["status"];
  created_at: string;
};

const supabase = () => createSupabaseServerClient();

const toBet = (row: BetRow): Bet => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  legs: row.legs,
  stake: Number(row.stake),
  totalOdd: Number(row.total_odd),
  potentialWin: Number(row.potential_win),
  status: row.status,
  createdAt: row.created_at,
});

const insertBet = async (bet: Bet) => {
  const { error } = await supabase().from("bets").insert({
    id: bet.id,
    user_id: bet.userId,
    type: bet.type,
    legs: bet.legs,
    stake: bet.stake,
    total_odd: bet.totalOdd,
    potential_win: bet.potentialWin,
    status: bet.status,
    created_at: bet.createdAt,
  });

  if (error) {
    throw new Error(`SUPABASE_CREATE_BET_FAILED:${error.message}`);
  }
};

const selectBetById = async (userId: string, betId: string) => {
  const { data, error } = await supabase()
    .from("bets")
    .select("id, user_id, type, legs, stake, total_odd, potential_win, status, created_at")
    .eq("user_id", userId)
    .eq("id", betId)
    .maybeSingle();

  if (error) {
    throw new Error(`SUPABASE_GET_BET_FAILED:${error.message}`);
  }

  return data ? toBet(data as BetRow) : null;
};

const selectBetsByUser = async (userId: string) => {
  const { data, error } = await supabase()
    .from("bets")
    .select("id, user_id, type, legs, stake, total_odd, potential_win, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`SUPABASE_LIST_BETS_FAILED:${error.message}`);
  }

  return (data ?? []).map((row) => toBet(row as BetRow));
};


export const getBetsByUser = async (userId: string) => {
  return selectBetsByUser(userId);
};

export const getBetById = async (userId: string, betId: string) => {
  return selectBetById(userId, betId);
};

export const createSimpleBet = async (
  userId: string,
  eventId: string,
  selection: BetSelection,
  stake: number,
) => {
  const event = eventById.get(eventId);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const odd =
    selection === BetSelection.HOME
      ? event.odds.home
      : selection === BetSelection.DRAW
        ? event.odds.draw
        : event.odds.away;

  const leg: BetLeg = {
    eventId: event.id,
    eventLabel: `${event.homeTeam} vs ${event.awayTeam}`,
    league: event.league,
    startTime: event.startTime,
    selection,
    odd,
  };

  const newBet: Bet = {
    id: randomUUID(),
    userId,
    type: BetType.SIMPLE,
    legs: [leg],
    stake,
    totalOdd: odd,
    potentialWin: stake * odd,
    status: BetStatus.PENDING,
    createdAt: new Date().toISOString(),
  };

  await insertBet(newBet);
  return newBet;
};

export const createMultipleBet = async (
  userId: string,
  selections: Array<{ eventId: string; selection: BetSelection }>,
  stake: number,
) => {
  const legs: BetLeg[] = selections.map(({ eventId, selection }) => {
    const event = eventById.get(eventId);
    if (!event) throw new Error("EVENT_NOT_FOUND");

    const odd =
      selection === BetSelection.HOME
        ? event.odds.home
        : selection === BetSelection.DRAW
          ? event.odds.draw
          : event.odds.away;

    return {
      eventId: event.id,
      eventLabel: `${event.homeTeam} vs ${event.awayTeam}`,
      league: event.league,
      startTime: event.startTime,
      selection,
      odd,
    };
  });

  const totalOdd = legs.reduce((acc, leg) => acc * leg.odd, 1);

  const newBet: Bet = {
    id: randomUUID(),
    userId,
    type: BetType.MULTIPLE,
    legs,
    stake,
    totalOdd,
    potentialWin: stake * totalOdd,
    status: BetStatus.PENDING,
    createdAt: new Date().toISOString(),
  };

  await insertBet(newBet);
  return newBet;
};

const createBet = async (userId: string, eventId: string, selection: BetSelection) => {
  return createSimpleBet(userId, eventId, selection, 10);
};
