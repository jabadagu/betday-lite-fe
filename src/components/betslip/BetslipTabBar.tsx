"use client";

import { useSession } from "next-auth/react";
import { dictionary } from "@betday/lib";
import { Box } from "@betday/components/ui";
import { type BetslipTab, useUIStateStore, useBetslipStore } from "@betday/store";

interface TabConfig {
  key: BetslipTab;
  label: string;
  badge?: number;
}

interface BetslipTabBarProps {
  activeBetsCount?: number;
}

export function BetslipTabBar({ activeBetsCount = 0 }: BetslipTabBarProps) {
  const { data: session } = useSession();
  const locale = useUIStateStore((s) => s.locale);
  const betslipTab = useBetslipStore((s) => s.betslipTab);
  const setBetslipTab = useBetslipStore((s) => s.setBetslipTab);
  const copy = dictionary[locale];
  const canViewActive = Boolean(session?.user?.id);

  const tabs: TabConfig[] = [
    { key: "simple", label: copy.simpleBet },
    { key: "multiple", label: copy.multipleBet },
  ];

  if (canViewActive) {
    tabs.push({
      key: "active",
      label: copy.activeBets,
      badge: activeBetsCount || undefined,
    });
  }

  return (
    <Box className="flex border-b border-line-primary">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setBetslipTab(tab.key)}
          className={`flex-1 py-2 text-center text-xs font-semibold transition-colors ${
            betslipTab === tab.key
              ? "border-b-2 border-brand-primary text-brand"
              : "text-tertiary hover:text-secondary"
          }`}
        >
          {tab.label}
          {tab.badge ? (
            <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-status-warning text-[0.55rem] font-bold text-white px-1">
              {tab.badge}
            </span>
          ) : null}
        </button>
      ))}
    </Box>
  );
}
