import type { Metadata } from "next";

import { dailyEvents } from "@/data/mock-events";
import { HomeClient } from "@betday/components/home-client";
import { buildHomeStructuredData, serializeJsonLd } from "@betday/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "BetDay — Tu casa de apuestas",
  description: "Simulador de apuestas deportivas 1X2 con cuotas en tiempo real",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = buildHomeStructuredData(dailyEvents);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HomeClient events={dailyEvents} />
    </>
  );
}
