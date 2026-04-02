"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { dictionary, t, formatMatchTime, placeBetSchema } from "@betday/lib";
import { Box, Button, Input, Typography } from "@betday/components/ui";
import { useUIStateStore, useBetslipStore } from "@betday/store";
import { postSimpleBet, postMultipleBet } from "@betday/services/betslip-api.service";

export function BetslipContent() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const locale = useUIStateStore((s) => s.locale);
  const pushNotice = useUIStateStore((s) => s.pushNotice);
  const openLoginModal = useUIStateStore((s) => s.openLoginModal);

  const stake = useBetslipStore((s) => s.stake);
  const balance = useBetslipStore((s) => s.balance);
  const selections = useBetslipStore((s) => s.selections);
  const betslipTab = useBetslipStore((s) => s.betslipTab);
  const setStake = useBetslipStore((s) => s.setStake);
  const setItemStake = useBetslipStore((s) => s.setItemStake);
  const setBetslipTab = useBetslipStore((s) => s.setBetslipTab);
  const removeSelection = useBetslipStore((s) => s.removeSelection);
  const clearSelections = useBetslipStore((s) => s.clearSelections);
  const consumeBalance = useBetslipStore((s) => s.consumeBalance);

  const isMultiple = betslipTab === "multiple";
  const isLoggedIn = Boolean(session?.user?.id);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isMultiple) {
        await postMultipleBet(
          selections.map((item) => ({
            eventId: item.eventId,
            selection: item.selection,
          })),
          stake,
        );
      } else {
        await Promise.all(
          selections.map((item) => postSimpleBet(item.eventId, item.selection, item.stake)),
        );
      }
      return true;
    },
    onSuccess: async () => {
      consumeBalance(totalStake);
      clearSelections();
      await queryClient.invalidateQueries({
        queryKey: ["bets", session?.user?.id],
      });
      pushNotice(t(locale, "placedOk"), "success");
      setBetslipTab("active");
    },
    onError: () => {
      pushNotice(t(locale, "errorGeneric"), "error");
    },
  });

  const handleConfirm = () => {
    if (!session?.user?.id) {
      openLoginModal(true);
      pushNotice(t(locale, "loginNeeded"), "info");
      return;
    }
    if (isMultiple) {
      const parsed = placeBetSchema.safeParse({ stake });
      if (!parsed.success) return;
      if (stake > balance) {
        pushNotice(t(locale, "insufficientBalance"), "error");
        return;
      }
    } else {
      const hasInvalidStake = selections.some((item) => item.stake < 1);
      if (hasInvalidStake) {
        pushNotice(t(locale, "minStake"), "error");
        return;
      }
      const totalSimple = selections.reduce((sum, item) => sum + item.stake, 0);
      if (totalSimple > balance) {
        pushNotice(t(locale, "insufficientBalance"), "error");
        return;
      }
    }
    mutation.mutate();
  };

  const totalOdds = selections.reduce((acc, item) => acc + item.odd, 0);
  const multipliedOdds = selections.reduce((acc, item) => acc * item.odd, 1);
  const totalSimpleStake = selections.reduce((sum, item) => sum + item.stake, 0);
  const totalStake = isMultiple ? stake : totalSimpleStake;
  const potentialWin = isMultiple
    ? stake * (selections.length >= 2 ? multipliedOdds : 0)
    : selections.reduce((sum, item) => sum + item.stake * item.odd, 0);
  const copy = dictionary[locale];
  const invalidMultipleStake = isMultiple && stake < 1;
  const insufficientBalance =
    isLoggedIn && (isMultiple ? stake > balance : totalSimpleStake > balance);

  useEffect(() => {
    if (!session?.user?.id && betslipTab === "active") {
      setBetslipTab("simple");
    }
  }, [session?.user?.id, betslipTab, setBetslipTab]);

  return (
    <Box className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <Box className="flex items-center justify-between border-b border-line-primary px-4 py-3">
        <Box className="flex items-center gap-2">
          <Typography variant="h3" className="md:text-sm">
            {copy.betslip}
          </Typography>
          {selections.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1.5 text-[0.6rem] font-bold text-inverse">
              {selections.length}
            </span>
          )}
        </Box>
        {/* Balance */}
        {session?.user && (
          <Typography
            variant="body3"
            component="span"
            className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs md:text-xs font-semibold text-secondary"
          >
            {copy.balance}: S/ {balance.toFixed(2)}
          </Typography>
        )}
      </Box>

      {/* Selections */}
      <Box className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
        {selections.length === 0 ? (
          <Box className="flex h-full items-center justify-center">
            <Typography variant="body2" className="text-center text-tertiary text-sm">
              {copy.noSelections}
            </Typography>
          </Box>
        ) : isMultiple && selections.length < 2 ? (
          <Box className="flex h-full items-center justify-center">
            <Typography variant="body2" className="text-center text-tertiary text-sm">
              {copy.noSelections}
            </Typography>
          </Box>
        ) : (
          <AnimatePresence mode="popLayout">
            {selections.map((item) => (
              <motion.div
                key={item.eventId}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="mb-2"
              >
                <Box className="rounded-radius-lg border border-line-primary bg-surface-secondary p-3">
                  <Box className="flex items-start justify-between gap-2">
                    <Box className="min-w-0">
                      <Typography
                        variant="body2"
                        component="p"
                        className="text-sm font-semibold text-primary truncate"
                      >
                        {item.eventLabel}
                      </Typography>
                      <Typography
                        variant="body3"
                        component="p"
                        className="text-[0.65rem] text-tertiary"
                      >
                        {item.league}
                      </Typography>
                      <Typography
                        variant="body3"
                        component="p"
                        className="text-[0.65rem] text-tertiary"
                      >
                        {formatMatchTime(item.startTime, locale)}
                      </Typography>
                    </Box>
                    <button
                      onClick={() => removeSelection(item.eventId)}
                      className="shrink-0 text-tertiary transition hover:text-status-error"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Box>
                  <Box className="mt-2 flex items-center justify-between">
                    <Typography
                      variant="body3"
                      component="span"
                      className="rounded-radius-sm bg-brand-primary-soft px-2 py-0.5 text-xs font-bold text-brand"
                    >
                      {item.selection} @ {item.odd.toFixed(2)}
                    </Typography>
                  </Box>
                  {/* Per-item stake for simple mode */}
                  {!isMultiple && (
                    <Box className="mt-2 flex items-center gap-2">
                      <Typography
                        variant="body3"
                        component="span"
                        className="text-[0.65rem] text-tertiary shrink-0"
                      >
                        S/
                      </Typography>
                      <Input
                        type="number"
                        min={1}
                        value={item.stake || ""}
                        onChange={(e) =>
                          setItemStake(
                            item.eventId,
                            e.target.value === "" ? 0 : Number(e.target.value),
                          )
                        }
                        inputSize="sm"
                        variant={item.stake < 1 ? "error" : "default"}
                        className="h-7 text-xs"
                      />
                      <Typography
                        variant="body3"
                        component="span"
                        className="text-[0.6rem] text-tertiary whitespace-nowrap"
                      >
                        → S/ {(item.stake * item.odd).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Box>

      {/* Footer — stake form */}
      <Box className="sticky bottom-0 z-10 shrink-0 border-t border-line-primary bg-surface-primary px-4 py-3 space-y-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        {/* Multiple mode: single global stake */}
        {isMultiple && (
          <Box>
            <Typography variant="eyebrow" className="mb-1.5">
              {copy.stake}
            </Typography>
            <Input
              type="number"
              min={1}
              value={stake || ""}
              onChange={(e) => setStake(e.target.value === "" ? 0 : Number(e.target.value))}
              inputSize="sm"
              variant={invalidMultipleStake || insufficientBalance ? "error" : "default"}
            />
            {invalidMultipleStake ? (
              <Typography variant="body3" className="mt-1 text-xs text-status-error">
                {copy.minStake}
              </Typography>
            ) : null}
            {insufficientBalance && (
              <Typography variant="body3" className="mt-1 text-xs text-status-error">
                {copy.insufficientBalance}
              </Typography>
            )}
          </Box>
        )}

        {/* Simple mode: show totals */}
        {!isMultiple && selections.length > 0 && (
          <Box>
            {insufficientBalance && (
              <Typography variant="body3" className="mb-1 text-xs text-status-error">
                {copy.insufficientBalance}
              </Typography>
            )}
          </Box>
        )}

        <Box className="space-y-1 text-sm">
          {isMultiple ? (
            <>
              <Box className="flex justify-between text-secondary">
                <Typography variant="body3" component="span">
                  {copy.accumulatedOdds}
                </Typography>
                <Typography variant="body3" component="span" className="font-semibold text-primary">
                  {selections.length >= 2 ? totalOdds.toFixed(2) : "—"}
                </Typography>
              </Box>
              <Box className="flex justify-between text-secondary">
                <Typography variant="body3" component="span">
                  {copy.potentialWin}
                </Typography>
                <Typography
                  variant="body3"
                  component="span"
                  className="font-bold text-brand-primary"
                >
                  {potentialWin ? `S/ ${potentialWin.toFixed(2)}` : "—"}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box className="flex justify-between text-secondary">
                <Typography variant="body3" component="span">
                  {copy.stake} ({selections.length} {copy.perBet})
                </Typography>
                <Typography variant="body3" component="span" className="font-semibold text-primary">
                  S/ {totalSimpleStake.toFixed(2)}
                </Typography>
              </Box>
              <Box className="flex justify-between text-secondary">
                <Typography variant="body3" component="span">
                  {copy.potentialWin}
                </Typography>
                <Typography
                  variant="body3"
                  component="span"
                  className="font-bold text-brand-primary"
                >
                  {potentialWin ? `S/ ${potentialWin.toFixed(2)}` : "—"}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Box className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={clearSelections}>
            {copy.clear}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleConfirm}
            disabled={
              mutation.isPending ||
              selections.length === 0 ||
              invalidMultipleStake ||
              insufficientBalance ||
              (isMultiple && selections.length < 2)
            }
            isLoading={mutation.isPending}
          >
            {copy.placeBet}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
