import { useEffect, useMemo, useState } from "react";

import type { MatchEvent } from "@betday/types";

const ITEMS_PER_PAGE = 10;

type UseEventPaginationParams = {
  events: MatchEvent[];
  activeFilter: string;
};

export function useEventPagination({ events, activeFilter }: UseEventPaginationParams) {
  const [currentPage, setCurrentPage] = useState(0);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((event) => event.tournament === activeFilter);
  }, [events, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter, events]);

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const pageEvents = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredEvents]);

  return {
    pageEvents,
    totalPages,
    currentPage,
    canGoBack: currentPage > 0,
    canGoForward: currentPage < totalPages - 1,
    setCurrentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: filteredEvents.length,
  };
}
