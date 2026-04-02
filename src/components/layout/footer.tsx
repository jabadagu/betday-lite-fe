"use client";

import { dictionary } from "@/lib/i18n";
import { Box } from "@/components/ui/box";
import { Typography } from "@/components/ui/typography";
import { useUIStateStore } from "@/lib/stores/ui-state-store";

export function Footer() {
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];

  return (
    <footer className="border-t border-line-primary bg-surface-primary">
      <Box className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center md:flex-row md:justify-between">
        <Box className="flex items-center gap-2">
          <Box className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-primary">
            <span className="text-[0.6rem] font-bold text-inverse">B</span>
          </Box>
          <Typography
            variant="body2"
            component="span"
            className="text-sm font-semibold text-primary"
          >
            {copy.appName}
          </Typography>
        </Box>
        <Typography variant="body3" className="text-xs text-tertiary">
          {copy.footer}
        </Typography>
      </Box>
    </footer>
  );
}
