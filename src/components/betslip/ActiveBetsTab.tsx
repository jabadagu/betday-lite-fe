"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Clock } from "lucide-react";
import { dictionary } from "@betday/lib";
import { Box, Typography } from "@betday/components/ui";
import { useUIStateStore } from "@betday/store";
import { fetchBets } from "@betday/services/betslip-api.service";
import { ConfirmedBetCard } from "./ConfirmedBetCard";

export function ActiveBetsTab() {
  const { data: session } = useSession();
  const { data: remoteBets = [], isLoading } = useQuery({
    queryKey: ["bets", session?.user?.id],
    queryFn: fetchBets,
    enabled: Boolean(session?.user?.id),
  });
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];

  const activeBets = remoteBets.filter((bet) => bet.status === "PENDING");

  if (isLoading) {
    return (
      <Box className="flex h-full items-center justify-center px-4 py-8">
        <Typography variant="body2" className="text-sm text-tertiary">
          Cargando apuestas en curso...
        </Typography>
      </Box>
    );
  }

  if (activeBets.length === 0) {
    return (
      <Box className="flex h-full flex-col">
        <Box className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <Clock className="h-10 w-10 text-tertiary mb-3" />
          <Typography variant="body2" className="text-center text-tertiary text-sm">
            {copy.noActiveBetsDesc}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex h-full flex-col">
      <Box className="flex-1 overflow-y-auto px-4 py-3 min-h-0 max-h-[80vh] space-y-2">
        {activeBets.map((bet) => (
          <ConfirmedBetCard key={bet.id} bet={bet} />
        ))}
      </Box>
    </Box>
  );
}
