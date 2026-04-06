"use client";

import { dictionary } from "@betday/lib";
import { Box, Button, Typography } from "@betday/components/ui";
import { EventCard } from "@betday/components/timeline";
import type { MatchEvent } from "@betday/types";
import { useUIStateStore } from "@betday/store";
import { useEventPagination } from "@betday/hooks";

type Props = {
  events: MatchEvent[];
};

export function EventList({ events }: Props) {
  const locale = useUIStateStore((s) => s.locale);
  const activeFilter = useUIStateStore((s) => s.activeFilter);
  const copy = dictionary[locale];
  const {
    pageEvents,
    totalPages,
    currentPage,
    canGoBack,
    canGoForward,
    setCurrentPage,
    totalItems,
    itemsPerPage,
  } = useEventPagination({ events, activeFilter });

  const startItem = totalItems === 0 ? 0 : currentPage * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(totalItems, startItem + pageEvents.length - 1);

  const navigationLabel =
    locale === "es"
      ? `Registros ${startItem}-${endItem} de ${totalItems}`
      : `Records ${startItem}-${endItem} of ${totalItems}`;

  const previousLabel = locale === "es" ? "Anterior" : "Previous";
  const nextLabel = locale === "es" ? "Siguiente" : "Next";

  return (
    <Box className="space-y-4">
      <Typography variant="eyebrow">{copy.timeline}</Typography>

      {pageEvents.length === 0 ? (
        <Typography variant="body2" className="py-8 text-center text-tertiary">
          No hay eventos para este filtro.
        </Typography>
      ) : (
        <Box className="space-y-6">
          {pageEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}

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
