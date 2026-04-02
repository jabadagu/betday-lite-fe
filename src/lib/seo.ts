import { ENV } from "@betday/config/env";
import type { MatchEvent } from "@betday/types";

type JsonLdValue = Record<string, unknown>;

const appUrl = new URL(ENV.NEXT_PUBLIC_APP_URL);

export const serializeJsonLd = (value: JsonLdValue) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export const buildHomeStructuredData = (events: MatchEvent[]) => {
  const featuredEvents = events.filter((event) => event.featured).slice(0, 6);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "BetDay",
        url: appUrl.toString(),
        logo: new URL("/google-512x512.png", appUrl).toString(),
      },
      {
        "@type": "WebSite",
        name: "BetDay",
        url: appUrl.toString(),
        description: "Simulador de apuestas deportivas 1X2 con cuotas en tiempo real",
      },
      {
        "@type": "ItemList",
        name: "Partidos destacados de BetDay",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: featuredEvents.length,
        itemListElement: featuredEvents.map((event, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${event.homeTeam} vs ${event.awayTeam}`,
          item: {
            "@type": "SportsEvent",
            name: `${event.homeTeam} vs ${event.awayTeam}`,
            startDate: event.startTime,
            sport: "Futbol",
            homeTeam: {
              "@type": "SportsTeam",
              name: event.homeTeam,
            },
            awayTeam: {
              "@type": "SportsTeam",
              name: event.awayTeam,
            },
          },
        })),
      },
    ],
  };
};
