"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Clock, XCircle, Calendar, Hash } from "lucide-react";

import { dictionary, formatMatchTime } from "@betday/lib";
import { Box, Card, Typography } from "@betday/components/ui";
import type { Bet } from "@betday/types";
import { useUIStateStore } from "@betday/store";

const statusConfig: Record<
  string,
  { icon: React.ReactNode; style: string; label: { es: string; en: string } }
> = {
  PENDING: {
    icon: <Clock className="h-4 w-4" />,
    style: "bg-status-warning-soft text-status-warning",
    label: { es: "Pendiente", en: "Pending" },
  },
  WON: {
    icon: <Trophy className="h-4 w-4" />,
    style: "bg-status-success-soft text-status-success",
    label: { es: "Ganada", en: "Won" },
  },
  LOST: {
    icon: <XCircle className="h-4 w-4" />,
    style: "bg-status-error-soft text-status-error",
    label: { es: "Perdida", en: "Lost" },
  },
};

export function BetDetailClient({ bet }: { bet: Bet }) {
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];
  const status = statusConfig[bet.status];
  const isMultiple = bet.type === "multiple";

  return (
    <Box className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-link hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {copy.profile}
      </Link>

      <Card className="space-y-5">
        {/* Header */}
        <Box className="flex items-start justify-between gap-3">
          <Typography variant="h2" className="text-primary">
            {isMultiple ? `${copy.multipleBetLabel} (${bet.legs.length})` : bet.legs[0]?.eventLabel}
          </Typography>
          {status && (
            <span
              className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-sm font-bold ${status.style}`}
            >
              {status.icon}
              {status.label[locale]}
            </span>
          )}
        </Box>

        {/* Legs list */}
        <Box className="space-y-3">
          {bet.legs.map((leg, i) => (
            <Box
              key={i}
              className="rounded-radius-lg bg-surface-secondary p-3 flex items-center justify-between gap-3"
            >
              <Box className="min-w-0">
                <Typography variant="body2" className="font-semibold text-primary text-sm truncate">
                  {leg.eventLabel}
                </Typography>
                <Typography variant="body3" className="text-[0.65rem] text-tertiary">
                  {formatMatchTime(leg.startTime, locale)}
                </Typography>
              </Box>
              <Box className="flex items-center gap-3 shrink-0">
                <Typography
                  variant="body3"
                  component="span"
                  className="rounded-radius-sm bg-brand-primary-soft px-2.5 py-1 text-xs font-bold text-brand"
                >
                  {leg.selection}
                </Typography>
                <Typography variant="body2" className="font-bold text-brand-primary">
                  {leg.odd.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Totals */}
        <Box className="grid grid-cols-3 gap-4">
          <Box className="rounded-radius-lg bg-surface-secondary p-3 space-y-1">
            <Typography variant="body3" className="text-xs text-tertiary">
              {copy.stakeLabel}
            </Typography>
            <Typography variant="body2" className="font-bold text-primary text-lg">
              S/ {bet.stake.toFixed(2)}
            </Typography>
          </Box>
          <Box className="rounded-radius-lg bg-surface-secondary p-3 space-y-1">
            <Typography variant="body3" className="text-xs text-tertiary">
              {copy.oddLabel}
            </Typography>
            <Typography variant="body2" className="font-bold text-brand-primary text-lg">
              {bet.totalOdd.toFixed(2)}
            </Typography>
          </Box>
          <Box className="rounded-radius-lg bg-surface-secondary p-3 space-y-1">
            <Typography variant="body3" className="text-xs text-tertiary">
              {copy.potentialWin}
            </Typography>
            <Typography variant="body2" className="font-bold text-status-success text-lg">
              S/ {bet.potentialWin.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Meta info */}
        <Box className="flex flex-wrap gap-4 border-t border-line-primary pt-4">
          <Box className="flex items-center gap-2 text-secondary">
            <Calendar className="h-4 w-4 text-tertiary" />
            <Typography variant="body3" className="text-sm">
              {new Date(bet.createdAt).toLocaleString(locale === "es" ? "es-ES" : "en-US")}
            </Typography>
          </Box>
          <Box className="flex items-center gap-2 text-secondary">
            <Hash className="h-4 w-4 text-tertiary" />
            <Typography variant="body3" className="text-sm font-mono">
              {bet.id.slice(0, 8)}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
