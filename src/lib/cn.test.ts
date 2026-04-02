import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("combina y resuelve clases en conflicto", () => {
    expect(cn("rounded-md px-2 text-sm", "px-4", false && "hidden")).toBe(
      "rounded-md text-sm px-4",
    );
  });
});
