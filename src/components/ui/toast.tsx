"use client";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/cn";
import { useUIStateStore } from "@/lib/stores/ui-state-store";

const typeStyles = {
  success: "bg-status-success text-inverse",
  error: "bg-status-error text-inverse",
  info: "bg-brand-secondary text-inverse",
};

export function Toast() {
  const notice = useUIStateStore((s) => s.notice);

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          key={notice.message}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          className={cn(
            "fixed right-4 top-20 z-[60] rounded-radius-lg px-4 py-2.5 text-sm font-semibold shadow-lg",
            typeStyles[notice.type],
          )}>
          {notice.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
