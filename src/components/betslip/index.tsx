"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { dictionary } from "@/lib/i18n";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { BetslipTabBar } from "./BetslipTabBar";
import { BetslipContent } from "./BetslipContent";
import { ActiveBetsTab } from "./ActiveBetsTab";
import { useBetslipStore } from "@/lib/stores/betslip-store";
import { useUIStateStore } from "@/lib/stores/ui-state-store";
import { fetchBets } from "@/services/betslip-api.service";

/* ─── Main betslip wrapper ─── */
function BetslipMain() {
  const { data: session } = useSession();
  const betslipTab = useBetslipStore((s) => s.betslipTab);
  const canViewActive = Boolean(session?.user?.id);

  const { data: remoteBets = [] } = useQuery({
    queryKey: ["bets", session?.user?.id],
    queryFn: fetchBets,
    enabled: canViewActive,
  });

  const activeBetsCount = remoteBets.filter((bet) => bet.status === "PENDING").length;

  return (
    <Box className="flex h-full flex-col">
      <BetslipTabBar activeBetsCount={activeBetsCount} />

      {/* Tab content */}
      {betslipTab === "active" && canViewActive ? <ActiveBetsTab /> : <BetslipContent />}
    </Box>
  );
}

/* Desktop sidebar */
export function BetslipSidebar() {
  return (
    <Card
      padding="none"
      className="sticky top-[65px] hidden h-[calc(100vh-80px)] w-[320px] shrink-0 flex-col overflow-hidden lg:flex"
    >
      <BetslipMain />
    </Card>
  );
}

/* Mobile bottom‑sheet / modal */
export function BetslipMobile() {
  const mobileSlipOpen = useUIStateStore((s) => s.mobileSlipOpen);
  const openMobileSlip = useUIStateStore((s) => s.openMobileSlip);

  return (
    <AnimatePresence>
      {mobileSlipOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-overlay lg:hidden"
            onClick={() => openMobileSlip(false)}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] rounded-t-2xl border-t border-line-primary bg-surface-primary shadow-xl lg:hidden"
          >
            {/* Drag handle */}
            <Box className="flex justify-center py-2">
              <Box className="h-1 w-10 rounded-full bg-border-secondary" />
            </Box>
            <Box className="max-h-[calc(90vh-16px)] overflow-hidden flex flex-col">
              <BetslipMain />
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* Floating mobile FAB */
export function BetslipFab() {
  const locale = useUIStateStore((s) => s.locale);
  const selections = useBetslipStore((s) => s.selections);
  const mobileSlipOpen = useUIStateStore((s) => s.mobileSlipOpen);
  const openMobileSlip = useUIStateStore((s) => s.openMobileSlip);
  const copy = dictionary[locale];
  const totalOdds = selections.reduce((acc, item) => acc + item.odd, 0);

  return (
    <motion.button
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      onClick={() => openMobileSlip(!mobileSlipOpen)}
      aria-label={copy.betslip}
      className={
        selections.length > 0
          ? "fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-brand-primary px-4 py-3 text-inverse shadow-lg lg:hidden"
          : "fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-inverse shadow-lg lg:hidden"
      }
    >
      {selections.length > 0 ? (
        <>
          <Box className="flex items-center gap-2">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1 text-xs font-bold text-inverse">
              {selections.length}
            </span>
            <Typography variant="body2" component="span" className="text-sm font-bold text-inverse">
              {copy.betslip}
            </Typography>
          </Box>
          <Typography variant="body3" component="span" className="text-xs text-inverse/80">
            Σ {totalOdds.toFixed(2)}
          </Typography>
        </>
      ) : (
        <Ticket className="h-6 w-6" />
      )}
    </motion.button>
  );
}
