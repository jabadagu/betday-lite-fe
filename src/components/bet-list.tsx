"use client";

import Link from "next/link";
import { Trophy, Clock, XCircle, ArrowRight, Ticket } from "lucide-react";

import { Bet } from "@betday/types";
import { dictionary, formatMatchTime } from "@betday/lib";
import { Card, Button, Typography, Box } from "@betday/components/ui";
import { useUIStateStore } from "@betday/store";

type Props = {
  bets: Bet[];
};
interface StatusConfig {
  [key: string]: {
    icon: React.ReactNode;
    style: string;
    label: { es: string; en: string };
  };
}

const statusConfig: Record<string, StatusConfig[string]> = {
  PENDING: {
    icon: <Clock className="h-3.5 w-3.5" />,
    style: "bg-status-warning-soft text-status-warning",
    label: { es: "Pendiente", en: "Pending" },
  },
  WON: {
    icon: <Trophy className="h-3.5 w-3.5" />,
    style: "bg-status-success-soft text-status-success",
    label: { es: "Ganada", en: "Won" },
  },
  LOST: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    style: "bg-status-error-soft text-status-error",
    label: { es: "Perdida", en: "Lost" },
  },
};

export function BetList({ bets }: Props) {
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];

  if (bets.length === 0) {
    return (
      <Card variant="outlined" className="border-dashed p-8 text-center">
        <Ticket className="mx-auto h-10 w-10 text-tertiary mb-3" />
        <Typography variant="h3">{copy.noBetsYet}</Typography>
        <Typography variant="body2" className="mt-2 text-secondary">
          {copy.noBetsDesc}
        </Typography>
        <Link href="/" className="mt-4 inline-block">
          <Button size="sm" rounded="full">
            {copy.goTimeline}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bets.map((bet) => {
        const status = statusConfig[bet.status];
        const isMultiple = bet.type === "multiple";
        return (
          <Card key={bet.id} className="space-y-3 transition-shadow hover:shadow-md">
            <Box className="flex items-start justify-between gap-2">
              <Box className="min-w-0">
                {isMultiple ? (
                  <Typography variant="body2" className="font-bold text-primary">
                    {copy.multipleBetLabel} ({bet.legs.length})
                  </Typography>
                ) : (
                  <Typography variant="body2" className="font-bold text-primary truncate">
                    {bet.legs[0]?.eventLabel}
                  </Typography>
                )}
              </Box>
              {status && (
                <span
                  className={`inline-flex items-center gap-1 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${status.style}`}
                >
                  {status.icon}
                  {status.label[locale]}
                </span>
              )}
            </Box>

            {/* Legs */}
            <Box className="space-y-1.5">
              {bet.legs.map((leg, i) => (
                <Box key={i} className="flex items-center justify-between text-sm">
                  <Box className="mr-2 min-w-0">
                    <Typography variant="body3" className="text-xs text-secondary truncate">
                      {leg.eventLabel}
                    </Typography>
                    <Typography variant="body3" className="text-[0.65rem] text-tertiary">
                      {formatMatchTime(leg.startTime, locale)}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2 shrink-0">
                    <Typography
                      variant="body3"
                      component="span"
                      className="rounded-radius-sm bg-brand-primary-soft px-2 py-0.5 text-xs font-bold text-brand"
                    >
                      {leg.selection}
                    </Typography>
                    <Typography
                      variant="body3"
                      component="span"
                      className="font-semibold text-primary text-xs"
                    >
                      {leg.odd.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Stake / Win info */}
            <Box className="flex items-center justify-between text-xs border-t border-line-primary pt-2">
              <Typography variant="body3" className="text-tertiary">
                {copy.stakeLabel}: S/ {bet.stake.toFixed(2)}
              </Typography>
              <Typography variant="body3" className="font-bold text-brand-primary">
                {copy.potentialWinLabel}: S/ {bet.potentialWin.toFixed(2)}
              </Typography>
            </Box>

            <Link
              href={`/bets/${bet.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline"
            >
              {copy.betDetail}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
