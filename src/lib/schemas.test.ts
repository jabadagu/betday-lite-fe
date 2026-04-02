import { describe, expect, it } from "vitest";

import { BetSelection } from "@betday/types";

import { createBetSchema, loginSchema, multipleBetSchema, simpleBetSchema } from "./schemas";

describe("loginSchema", () => {
  it("acepta credenciales validas", () => {
    expect(
      loginSchema.safeParse({
        email: "ana@betday.dev",
        password: "betday123",
      }).success,
    ).toBe(true);
  });

  it("rechaza credenciales invalidas", () => {
    expect(
      loginSchema.safeParse({
        email: "no-es-un-email",
        password: "123",
      }).success,
    ).toBe(false);
  });
});

describe("createBetSchema", () => {
  it("valida una apuesta simple", () => {
    const result = createBetSchema.safeParse({
      type: "simple",
      eventId: "ev-1",
      selection: BetSelection.HOME,
      stake: 25,
    });

    expect(result.success).toBe(true);
    expect(
      simpleBetSchema.safeParse({
        type: "simple",
        eventId: "ev-1",
        selection: BetSelection.HOME,
        stake: 25,
      }).success,
    ).toBe(true);
  });

  it("valida una apuesta multiple con al menos dos selecciones", () => {
    const result = createBetSchema.safeParse({
      type: "multiple",
      selections: [
        { eventId: "ev-1", selection: BetSelection.HOME },
        { eventId: "ev-2", selection: BetSelection.DRAW },
      ],
      stake: 10,
    });

    expect(result.success).toBe(true);
    expect(
      multipleBetSchema.safeParse({
        type: "multiple",
        selections: [{ eventId: "ev-1", selection: BetSelection.HOME }],
        stake: 10,
      }).success,
    ).toBe(false);
  });
});
