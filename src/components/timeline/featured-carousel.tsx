"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { dictionary, formatMatchTime } from "@betday/lib";
import { Box, Card, Typography } from "@betday/components/ui";
import { OddsButton } from "@betday/components/bets/odds-button";
import { BetSelection, Locale, type MatchEvent } from "@betday/types";
import { useUIStateStore } from "@betday/store";

type Props = {
  events: MatchEvent[];
};

export function FeaturedCarousel({ events }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];

  const featured = events.filter((e) => e.featured);

  if (featured.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <Box className="space-y-3">
      <Box className="flex items-center justify-between px-1">
        <Typography variant="eyebrow">{copy.featured}</Typography>
        <Box className="hidden gap-1.5 md:flex">
          <button
            onClick={() => scroll("left")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line-primary bg-surface-primary text-secondary transition hover:bg-surface-secondary cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line-primary bg-surface-primary text-secondary transition hover:bg-surface-secondary cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </Box>
      </Box>

      <div
        ref={scrollRef}
        className="hide-scrollbar flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
      >
        <AnimatePresence>
          {featured.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="w-[280px] shrink-0 snap-start md:w-[320px]"
            >
              <FeaturedCard event={event} locale={locale} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Box>
  );
}

function FeaturedCard({ event, locale }: { event: MatchEvent; locale: Locale }) {
  const time = formatMatchTime(event.startTime, locale);

  return (
    <Card variant="elevated" className="space-y-3 bg-surface-primary">
      <Box className="flex items-center justify-between">
        <Typography
          variant="eyebrow"
          component="span"
          className="rounded-full bg-brand-accent-soft px-2 py-0.5 text-[0.6rem] font-bold text-brand-accent"
        >
          {event.league}
        </Typography>
        <Typography variant="body3" component="span" className="text-xs font-medium text-tertiary">
          {time}
        </Typography>
      </Box>

      <Box className="text-center space-y-1">
        <Typography variant="h3" className="text-base">
          {event.homeTeam}
        </Typography>
        <Typography variant="body3" component="span" className="text-xs font-bold text-tertiary">
          VS
        </Typography>
        <Typography variant="h3" className="text-base">
          {event.awayTeam}
        </Typography>
      </Box>

      <Box className="grid grid-cols-3 gap-2">
        <OddsButton event={event} selection={BetSelection.HOME} label="1" odd={event.odds.home} />
        <OddsButton event={event} selection={BetSelection.DRAW} label="X" odd={event.odds.draw} />
        <OddsButton event={event} selection={BetSelection.AWAY} label="2" odd={event.odds.away} />
      </Box>
    </Card>
  );
}
