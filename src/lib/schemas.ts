import { BetSelection } from "@betday/types";
import { z } from "zod";

/* Bet Schemas */
export const placeBetSchema = z.object({
  stake: z.number().min(1).max(50000),
});

/* User Schemas */

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

/* bets schemas  */

export const simpleBetSchema = z.object({
  type: z.literal("simple"),
  eventId: z.string().min(1),
  selection: z.enum([BetSelection.HOME, BetSelection.DRAW, BetSelection.AWAY]),
  stake: z.number().min(1),
});

export const multipleBetSchema = z.object({
  type: z.literal("multiple"),
  selections: z
    .array(
      z.object({
        eventId: z.string().min(1),
        selection: z.enum([BetSelection.HOME, BetSelection.DRAW, BetSelection.AWAY]),
      }),
    )
    .min(2),
  stake: z.number().min(1),
});

export const createBetSchema = z.union([simpleBetSchema, multipleBetSchema]);
