import { describe, expect, it } from "vitest";

import { buildHomeStructuredData, serializeJsonLd } from "./seo";

describe("serializeJsonLd", () => {
  it("escapa caracteres peligrosos para script tags", () => {
    expect(serializeJsonLd({ title: "<script>alert(1)</script>" })).toBe(
      '{"title":"\\u003cscript>alert(1)\\u003c/script>"}',
    );
  });
});

describe("buildHomeStructuredData", () => {
  it("solo incluye los primeros seis eventos destacados", () => {
    const events = Array.from({ length: 7 }, (_, index) => ({
      id: `ev-${index + 1}`,
      league: "Test League",
      tournament: "Test Cup",
      startTime: `2026-04-02T1${index}:00:00.000Z`,
      homeTeam: `Home ${index + 1}`,
      awayTeam: `Away ${index + 1}`,
      featured: true,
      odds: { home: 2, draw: 3, away: 4 },
    }));

    const structuredData = buildHomeStructuredData(events);
    const itemList = structuredData["@graph"][2] as {
      numberOfItems: number;
      itemListElement: Array<{ name: string }>;
    };

    expect(itemList.numberOfItems).toBe(6);
    expect(itemList.itemListElement).toHaveLength(6);
    expect(itemList.itemListElement[0].name).toBe("Home 1 vs Away 1");
    expect(itemList.itemListElement[5].name).toBe("Home 6 vs Away 6");
  });
});
