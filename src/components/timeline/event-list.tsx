"use client";

import { useEffect, useMemo, useState } from "react";

import { dictionary, formatDayLabel } from "@betday/lib";
import { Box, Button, Typography } from "@betday/components/ui";
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
  const [currentPage, setCurrentPage] = useState(0);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => e.tournament === activeFilter);
  }, [events, activeFilter]);

  const groupedByDay = useMemo(() => {
    const byDay = new Map<string, MatchEvent[]>();

    for (const event of filtered) {
      const date = new Date(event.startTime);
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`;
      const list = byDay.get(dayKey) ?? [];
      byDay.set(dayKey, [...list, event]);
    }

    return Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([dayKey, dayEvents]) => ({
        dayKey,
        dayEvents: dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
  }, [filtered]);

  const visibleDayGroups = groupedByDay.slice(currentPage, currentPage + 1);
  const totalPages = groupedByDay.length;
  const canGoBack = currentPage > 0;
  const canGoForward = currentPage < totalPages - 1;

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter, events]);

  const navigationLabel =
    locale === "es"
      ? `Día ${currentPage + 1} de ${Math.max(totalPages, 1)}`
      : `Day ${currentPage + 1} of ${Math.max(totalPages, 1)}`;

  const previousLabel = locale === "es" ? "Anterior" : "Previous";
  const nextLabel = locale === "es" ? "Siguiente" : "Next";

  return (
    <Box className="space-y-4">
      <Typography variant="eyebrow">{copy.timeline}</Typography>

      {groupedByDay.length === 0 ? (
        <Typography variant="body2" className="py-8 text-center text-tertiary">
          No hay eventos para este filtro.
        </Typography>
      ) : (
        <Box className="space-y-6">
          {visibleDayGroups.map(({ dayKey, dayEvents }) => {
            const hourGroups = Array.from(
              dayEvents.reduce((map, event) => {
                const date = new Date(event.startTime);
                const hourKey = `${String(date.getHours()).padStart(2, "0")}:00`;
                const list = map.get(hourKey) ?? [];
                map.set(hourKey, [...list, event]);
                return map;
              }, new Map<string, MatchEvent[]>()),
            ).sort((a, b) => a[0].localeCompare(b[0]));

            return (
              <Box key={dayKey} className="space-y-3">
                <Box className="flex items-center gap-3 px-1">
                  <Typography
                    variant="h3"
                    component="span"
                    className="text-lg font-bold text-primary"
                  >
                    {formatDayLabel(dayKey, locale)}
                  </Typography>
                  <Box className="h-px flex-1 bg-border-primary" />
                </Box>

                <Box className="space-y-4">
                  {hourGroups.map(([hour, hourEvents]) => (
                    <Box key={`${dayKey}-${hour}`} className="space-y-2">
                      <Box className="flex items-center gap-3 px-1">
                        <Typography
                          variant="h3"
                          component="span"
                          className="text-base font-bold text-primary"
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
              </Box>
            );
          })}

          <Box className="flex items-center justify-between gap-3 rounded-radius-lg border border-line-primary bg-surface-primary px-3 py-2">
            <Typography variant="body3" className="text-xs font-semibold text-secondary">
              {navigationLabel}
            </Typography>
            <Box className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-3"
                onClick={() => setCurrentPage((current) => Math.max(0, current - 1))}
                disabled={!canGoBack}
              >
                {previousLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={() => setCurrentPage((current) => Math.min(totalPages - 1, current + 1))}
                disabled={!canGoForward}
              >
                {nextLabel}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
