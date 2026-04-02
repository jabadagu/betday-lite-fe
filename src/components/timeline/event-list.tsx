"use client";

import { useMemo } from "react";

import { dictionary } from "@betday/lib";
import { Box, Typography } from "@betday/components/ui";
import { EventCard } from "@betday/components/timeline";
import type { MatchEvent } from "@betday/types";
import { useUIStateStore } from "@betday/store";

type Props = {
  events: MatchEvent[];
};

export function EventList({ events }: Props) {
  const locale = useUIStateStore((s) => s.locale);
  const activeFilter = useUIStateStore((s) => s.activeFilter);
  const copy = dictionary[locale];

  const filtered = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => e.tournament === activeFilter);
  }, [events, activeFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, MatchEvent[]>();
    for (const event of filtered) {
      const date = new Date(event.startTime);
      const hourKey = `${String(date.getHours()).padStart(2, "0")}:00`;
      const list = map.get(hourKey) ?? [];
      map.set(hourKey, [...list, event]);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <Box className="space-y-4">
      <Typography variant="eyebrow">{copy.timeline}</Typography>

      {grouped.length === 0 ? (
        <Typography variant="body2" className="py-8 text-center text-tertiary">
          No hay eventos para este filtro.
        </Typography>
      ) : (
        <Box className="space-y-6">
          {grouped.map(([hour, hourEvents]) => (
            <Box key={hour} className="space-y-2">
              <Box className="flex items-center gap-3 px-1">
                <Typography
                  variant="h3"
                  component="span"
                  className="text-lg font-bold text-primary"
                >
                  {hour}
                </Typography>
                <Box className="h-px flex-1 bg-border-primary" />
              </Box>
              <Box className="space-y-2">
                {hourEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
