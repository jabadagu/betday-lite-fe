"use client";

import { cn } from "@betday/lib";
import { Typography } from "@betday/components/ui";
import type { BetSelection, MatchEvent } from "@betday/types";
import { useBetslipStore, useUIStateStore } from "@betday/store";

type Props = {
  event: MatchEvent;
  selection: BetSelection;
  label: string;
  odd: number;
};

export function OddsButton({ event, selection, label, odd }: Props) {
  const toggleSelection = useBetslipStore((s) => s.toggleSelection);
  const betslipTab = useBetslipStore((s) => s.betslipTab);
  const selections = useBetslipStore((s) => s.selections);
  const hasShownModalInSession = useUIStateStore((s) => s.hasShownModalInSession);
  const setHasShownModalInSession = useUIStateStore((s) => s.setHasShownModalInSession);
  const openMobileSlip = useUIStateStore((s) => s.openMobileSlip);

  const selected = selections.some(
    (sel) => sel.eventId === event.id && sel.selection === selection,
  );

  const handleClick = () => {
    toggleSelection(event, selection);

    // Open mobile slip on first selection in multiple tab, only if window is small
    if (
      betslipTab === "multiple" &&
      !hasShownModalInSession &&
      typeof window !== "undefined" &&
      window.innerWidth < 1024
    ) {
      setHasShownModalInSession(true);
      openMobileSlip(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-radius-lg border px-2 py-2 text-sm font-semibold transition-all duration-200",
        selected
          ? "border-odds-border-selected bg-odds-bg-selected text-odds-text-selected shadow-sm"
          : "border-odds-border bg-odds-bg text-odds-text hover:bg-odds-bg-hover hover:border-line-secondary",
      )}
    >
      <Typography
        variant="body3"
        component="span"
        className={cn(
          "text-[0.6rem] font-bold",
          selected ? "text-odds-text-selected opacity-90" : "opacity-70",
        )}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="span"
        className={cn("text-sm font-bold", selected ? "text-odds-text-selected" : "")}
      >
        {odd.toFixed(2)}
      </Typography>
    </button>
  );
}
