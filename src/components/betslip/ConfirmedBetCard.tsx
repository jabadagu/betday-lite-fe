"use client";

import { Clock } from "lucide-react";
import { dictionary, formatMatchTime } from "@betday/lib";
import { Box, Typography } from "@betday/components/ui";
import type { Bet } from "@betday/types";
import { useUIStateStore } from "@betday/store";

interface ConfirmedBetCardProps {
  bet: Bet;
}

export function ConfirmedBetCard({ bet }: ConfirmedBetCardProps) {
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];
  const isMultiple = bet.type === "multiple";

  return (
    <Box className="rounded-radius-lg border border-line-primary bg-surface-secondary p-3 space-y-2">
      <Box className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-status-warning-soft px-2 py-0.5 text-[0.6rem] font-bold text-status-warning">
          <Clock className="h-3 w-3" />
          {copy.inProgress}
        </span>
        <Typography variant="body3" className="text-[0.6rem] text-tertiary">
          {isMultiple ? copy.multipleBetLabel : copy.simpleBet}
        </Typography>
      </Box>
      {bet.legs.map((leg, i) => (
        <Box key={i} className="flex items-center justify-between">
          <Box className="min-w-0">
            <Typography variant="body3" className="text-xs font-semibold text-primary truncate">
              {leg.eventLabel}
            </Typography>
            <Typography variant="body3" className="text-[0.6rem] text-tertiary">
              {leg.league}
            </Typography>
            <Typography variant="body3" className="text-[0.6rem] text-tertiary">
              {formatMatchTime(leg.startTime, locale)}
            </Typography>
          </Box>
          <Typography
            variant="body3"
            component="span"
            className="shrink-0 rounded-radius-sm bg-brand-primary-soft px-2 py-0.5 text-xs font-bold text-brand"
          >
            {leg.selection} @ {leg.odd.toFixed(2)}
          </Typography>
        </Box>
      ))}
      <Box className="flex items-center justify-between border-t border-line-primary pt-2 text-xs">
        <Typography variant="body3" className="text-tertiary">
          {copy.stakeLabel}: S/ {bet.stake.toFixed(2)}
        </Typography>
        <Typography variant="body3" className="font-bold text-brand-primary">
          {copy.potentialWinLabel}: S/ {bet.potentialWin.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}
