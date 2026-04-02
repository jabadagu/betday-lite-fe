"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BetSelection } from "@/types/bet";
import type { MatchEvent } from "@/types/event";

type SlipItem = {
  eventId: string;
  eventLabel: string;
  league: string;
  startTime: string;
  selection: BetSelection;
  odd: number;
  stake: number;
  status: "draft" | "in-progress";
};

export type BetslipTab = "simple" | "multiple" | "active";

type BetslipState = {
  stake: number;
  balance: number;
  selections: SlipItem[];
  betslipTab: BetslipTab;
};

type BetslipActions = {
  setStake: (value: number) => void;
  setBalance: (value: number) => void;
  consumeBalance: (amount: number) => void;
  addSelection: (event: MatchEvent, selection: BetSelection) => void;
  removeSelection: (eventId: string) => void;
  toggleSelection: (event: MatchEvent, selection: BetSelection) => void;
  clearSelections: () => void;
  setItemStake: (eventId: string, value: number) => void;
  setBetslipTab: (tab: BetslipTab) => void;
  isSelected: (eventId: string, selection: BetSelection) => boolean;
};

type BetslipStore = BetslipState & BetslipActions;

const pickOdd = (event: MatchEvent, selection: BetSelection) => {
  if (selection === "1") return event.odds.home;
  if (selection === "X") return event.odds.draw;
  return event.odds.away;
};

const INITIAL_BALANCE = 1000;
const DEFAULT_ITEM_STAKE = 10;

export const useBetslipStore = create<BetslipStore>()(
  persist(
    (set, get) => ({
      stake: 10,
      balance: INITIAL_BALANCE,
      selections: [],
      betslipTab: "simple",

      setStake: (value) => set({ stake: Math.max(0, value) }),
      setBalance: (value) => set({ balance: Math.max(0, value) }),
      consumeBalance: (amount) =>
        set((state) => ({
          balance: Math.max(0, state.balance - Math.max(0, amount)),
        })),

      addSelection: (event, selection) =>
        set((state) => {
          const nextItem: SlipItem = {
            eventId: event.id,
            eventLabel: `${event.homeTeam} vs ${event.awayTeam}`,
            league: event.league,
            startTime: event.startTime,
            selection,
            odd: pickOdd(event, selection),
            stake: DEFAULT_ITEM_STAKE,
            status: "draft",
          };
          const filtered = state.selections.filter((item) => item.eventId !== event.id);
          const nextSelections = [nextItem, ...filtered];
          return {
            selections: nextSelections,
            betslipTab:
              nextSelections.length > 1
                ? ("multiple" as BetslipTab)
                : ("simple" as BetslipTab),
          };
        }),

      removeSelection: (eventId) =>
        set((state) => {
          const nextSelections = state.selections.filter((item) => item.eventId !== eventId);
          return {
            selections: nextSelections,
            betslipTab:
              nextSelections.length > 1
                ? ("multiple" as BetslipTab)
                : ("simple" as BetslipTab),
          };
        }),

      toggleSelection: (event, selection) => {
        const state = get();
        const existing = state.selections.find((s) => s.eventId === event.id);
        if (existing && existing.selection === selection) {
          state.removeSelection(event.id);
        } else {
          state.addSelection(event, selection);
        }
      },

      clearSelections: () => set({ selections: [] }),

      setItemStake: (eventId, value) =>
        set((state) => ({
          selections: state.selections.map((item) =>
            item.eventId === eventId ? { ...item, stake: Math.max(0, value) } : item,
          ),
        })),

      setBetslipTab: (tab) => set({ betslipTab: tab }),

      isSelected: (eventId, selection) => {
        const state = get();
        return state.selections.some((s) => s.eventId === eventId && s.selection === selection);
      },
    }),
    {
      name: "betday-betslip",
      version: 1,
    },
  ),
);
