"use client";

import { Box } from "@betday/components/ui";
import { FeaturedCarousel, LeagueFilters, EventList } from "@betday/components/timeline";
import { BetslipSidebar } from "@betday/components/betslip";
import type { MatchEvent } from "@betday/types";

type Props = {
  events: MatchEvent[];
};

export function HomeClient({ events }: Props) {
  return (
    <Box className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-4 lg:py-6">
      {/* Main content */}
      <Box className="flex-1 min-w-0 space-y-6">
        <FeaturedCarousel events={events} />
        <LeagueFilters />
        <EventList events={events} />
      </Box>

      {/* Desktop betslip sidebar */}
      <BetslipSidebar />
    </Box>
  );
}
