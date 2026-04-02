"use client";

import { dictionary } from "@/lib/i18n";
import { Chip } from "@/components/ui/chip";
import { Box } from "@/components/ui/box";
import { useUIStateStore } from "@/lib/stores/ui-state-store";

const FILTERS = [
  { key: "all", labelKey: "all" as const },
  { key: "Europe", labelKey: "europe" as const },
  { key: "Champions", labelKey: "champions" as const },
  { key: "Libertadores", labelKey: "libertadores" as const },
];

export function LeagueFilters() {
  const locale = useUIStateStore((s) => s.locale);
  const activeFilter = useUIStateStore((s) => s.activeFilter);
  const setActiveFilter = useUIStateStore((s) => s.setActiveFilter);
  const copy = dictionary[locale];

  return (
    <Box className='flex gap-2 overflow-x-auto pb-1 hide-scrollbar'>
      {FILTERS.map((f) => (
        <Chip
          key={f.key}
          active={activeFilter === f.key}
          onClick={() => setActiveFilter(f.key)}>
          {copy[f.labelKey]}
        </Chip>
      ))}
    </Box>
  );
}
