import { describe, expect, it, vi } from "vitest";

import { Locale } from "@betday/types";

import { formatMatchTime } from "./time";

describe("formatMatchTime", () => {
  it.each([
    [Locale.ES, "es-ES"],
    [Locale.EN, "en-US"],
  ])("usa el locale correcto para %s", (locale, expectedLocale) => {
    const format = vi.fn().mockReturnValue("14:30");
    const dateTimeFormatSpy = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
      class {
        format = format;
      } as unknown as typeof Intl.DateTimeFormat,
    );

    const result = formatMatchTime("2026-04-02T14:30:00.000Z", locale);

    expect(dateTimeFormatSpy).toHaveBeenCalledWith(expectedLocale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    expect(format).toHaveBeenCalledTimes(1);
    expect(result).toBe("14:30");
  });
});
