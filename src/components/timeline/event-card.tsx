"use client";

import { motion } from "framer-motion";

import { formatMatchTime } from "@betday/lib";
import { Box, Card, Typography } from "@betday/components/ui";
import { OddsButton } from "@betday/components/bets/odds-button";
import { BetSelection, type MatchEvent } from "@betday/types";
import { useUIStateStore } from "@betday/store";

type Props = {
  event: MatchEvent;
  index: number;
};

export function EventCard({ event, index }: Props) {
  const locale = useUIStateStore((s) => s.locale);
  const time = formatMatchTime(event.startTime, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className="space-y-3">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Typography variant="eyebrow" component="span" className="text-[0.6rem]">
              {event.league}
            </Typography>
          </Box>
          <Typography variant="body3" component="span" className="text-xs text-tertiary">
            {time}
          </Typography>
        </Box>

        <Box className="flex items-center justify-between gap-3">
          <Box className="flex-1 min-w-0">
            <Typography variant="body2" className="text-sm font-semibold text-primary truncate">
              {event.homeTeam}
            </Typography>
            <Typography variant="body2" className="text-sm font-semibold text-primary truncate">
              {event.awayTeam}
            </Typography>
          </Box>

          <Box className="grid grid-cols-3 gap-1.5 shrink-0">
            <OddsButton
              event={event}
              selection={BetSelection.HOME}
              label="1"
              odd={event.odds.home}
            />
            <OddsButton
              event={event}
              selection={BetSelection.DRAW}
              label="X"
              odd={event.odds.draw}
            />
            <OddsButton
              event={event}
              selection={BetSelection.AWAY}
              label="2"
              odd={event.odds.away}
            />
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}
