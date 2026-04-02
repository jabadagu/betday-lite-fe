"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Globe, Settings, Ticket } from "lucide-react";

import { dictionary, formatMatchTime } from "@betday/lib";
import { Box, Card, Switch, Typography } from "@betday/components/ui";
import { Locale, type Bet } from "@betday/types";
import { useUIStateStore, useBetslipStore } from "@betday/store";

type Props = {
  name: string;
  email: string;
  totalBets: number;
  activeBets: Bet[];
  children: React.ReactNode;
};

function getInitials(name?: string, email?: string) {
  if (name) {
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "U";
}

export function ProfileShell({ name, email, totalBets, activeBets, children }: Props) {
  const locale = useUIStateStore((s) => s.locale);
  const setLocale = useUIStateStore((s) => s.setLocale);
  const balance = useBetslipStore((s) => s.balance);
  const copy = dictionary[locale];
  const { setTheme, resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  return (
    <Box className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 space-y-6">
      {/* User info card */}
      <Card className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <Box className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-inverse shrink-0">
          {getInitials(name, email)}
        </Box>
        <Box className="flex-1 text-center sm:text-left space-y-1">
          <Typography variant="h2" className="text-primary">
            {name || email}
          </Typography>
          <Typography variant="body3" className="text-sm text-secondary">
            {email}
          </Typography>
          <Box className="flex flex-wrap justify-center gap-4 pt-2 sm:justify-start">
            <Box className="flex items-center gap-1.5 text-xs">
              <Ticket className="h-3.5 w-3.5 text-tertiary" />
              <Typography variant="body3" className="text-secondary">
                {copy.totalBets}: <span className="font-bold text-primary">{totalBets}</span>
              </Typography>
            </Box>
            <Box className="flex items-center gap-1.5 text-xs">
              <Typography variant="body3" className="text-secondary">
                {copy.balance}:{" "}
                <span className="font-bold text-brand-primary">S/ {balance.toFixed(2)}</span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Settings section */}
      <Card>
        <Box className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-tertiary" />
          <Typography variant="h3" className="text-sm font-bold text-primary">
            {copy.settings}
          </Typography>
        </Box>
        <Box className="space-y-3">
          <Box className="flex items-center justify-between rounded-radius-lg border border-line-primary bg-surface-secondary px-3 py-2">
            <Box className="flex items-center gap-2">
              <Typography variant="body3" className="font-semibold text-secondary">
                {copy.theme}
              </Typography>
            </Box>
            <Switch
              checked={isDarkTheme}
              onChange={(checked) => setTheme(checked ? "dark" : "light")}
              size="sm"
              ariaLabel={copy.theme}
              iconOff={<Sun className="h-3.5 w-3.5" />}
              iconOn={<Moon className="h-3.5 w-3.5" />}
            />
          </Box>

          <Box className="flex items-center justify-between rounded-radius-lg border border-line-primary bg-surface-secondary px-3 py-2">
            <Box className="flex items-center gap-2">
              <Typography variant="body3" className="font-semibold text-secondary">
                {copy.language}
              </Typography>
            </Box>
            <Switch
              checked={locale === Locale.EN}
              onChange={(checked) => setLocale(checked ? Locale.EN : Locale.ES)}
              size="sm"
              ariaLabel={copy.language}
              iconOff={<span className="text-[0.6rem] font-bold">ES</span>}
              iconOn={<span className="text-[0.6rem] font-bold">EN</span>}
            />
          </Box>
        </Box>
      </Card>

      {/* Active bets section */}
      {activeBets.length > 0 && (
        <Card>
          <Box className="flex items-center gap-2 mb-4">
            <Ticket className="h-4 w-4 text-status-warning" />
            <Typography variant="h3" className="text-sm font-bold text-primary">
              {copy.activeBets}
            </Typography>
            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-status-warning-soft px-1.5 text-[0.6rem] font-bold text-status-warning">
              {activeBets.length}
            </span>
          </Box>
          <Box className="space-y-2">
            {activeBets.map((bet) => (
              <Box
                key={bet.id}
                className="rounded-lg border border-line-primary bg-surface-secondary p-3 space-y-2"
              >
                <Box className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-warning-soft px-2 py-0.5 text-[0.6rem] font-bold text-status-warning">
                    {bet.type === "multiple" ? copy.multipleBetLabel : copy.simpleBet}
                  </span>
                  <Typography variant="body3" className="text-xs text-tertiary">
                    {new Date(bet.createdAt).toLocaleDateString(
                      locale === "es" ? "es-ES" : "en-US",
                    )}
                  </Typography>
                </Box>
                {bet.legs.map((leg, i) => (
                  <Box key={i} className="flex items-center justify-between text-xs">
                    <Box className="min-w-0 flex-1">
                      <Typography variant="body3" className="font-semibold text-primary truncate">
                        {leg.eventLabel}
                      </Typography>
                      <Typography variant="body3" className="text-tertiary">
                        {leg.league}
                      </Typography>
                      <Typography variant="body3" className="text-tertiary">
                        {formatMatchTime(leg.startTime, locale)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body3"
                      className="shrink-0 rounded bg-brand-primary-soft px-2 py-0.5 font-bold text-brand ml-2"
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
            ))}
          </Box>
        </Card>
      )}

      {/* Bet history */}
      <Box>
        <Typography variant="h3" className="text-base font-bold text-primary mb-4">
          {copy.betHistory}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
