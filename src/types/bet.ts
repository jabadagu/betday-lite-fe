import { BetSelection, BetStatus, BetType } from "./enums";

export { BetSelection, BetStatus, BetType };

export type BetLeg = {
  eventId: string;
  eventLabel: string;
  league: string;
  startTime: string;
  selection: BetSelection;
  odd: number;
};

export type Bet = {
  id: string;
  userId: string;
  type: BetType;
  legs: BetLeg[];
  stake: number;
  totalOdd: number;
  potentialWin: number;
  status: BetStatus;
  createdAt: string;
};

type CreateBetInput = {
  eventId: string;
  selection: BetSelection;
};
