"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Ticket, ClipboardList } from "lucide-react";

import { dictionary } from "@/lib/i18n";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useUIStateStore } from "@/lib/stores/ui-state-store";
import { useBetslipStore } from "@/lib/stores/betslip-store";

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "U";
}

/* Avatar with dropdown */
function AvatarMenu() {
  const { data: session } = useSession();
  const locale = useUIStateStore((s) => s.locale);
  const copy = dictionary[locale];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = getInitials(session?.user?.name, session?.user?.email);

  return (
    <Box className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-inverse transition hover:opacity-90 cursor-pointer"
      >
        {initials}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-radius-lg border border-line-primary bg-surface-primary shadow-md"
          >
            <Box className="border-b border-line-primary px-3 py-2">
              <Typography variant="body2" className="font-semibold text-primary text-sm truncate">
                {session?.user?.name}
              </Typography>
              <Typography variant="body3" className="text-[0.65rem] text-tertiary truncate">
                {session?.user?.email}
              </Typography>
            </Box>
            <Box className="py-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-secondary transition hover:bg-surface-secondary"
              >
                <span className="text-base">
                  <User className="h-4 w-4" />
                </span>
                {copy.profile}
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-status-error transition hover:bg-surface-secondary"
              >
                <span className="text-base">
                  <LogOut className="h-4 w-4" />
                </span>
                {copy.logout}
              </button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Click-away overlay */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </Box>
  );
}

export function Header() {
  const { data: session } = useSession();
  const locale = useUIStateStore((s) => s.locale);
  const balance = useBetslipStore((s) => s.balance);
  const copy = dictionary[locale];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line-primary bg-surface-primary/95 backdrop-blur-sm relative">
      <Box className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Box className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary">
            <span className="text-sm font-black text-inverse">B</span>
          </Box>
          <Box>
            <Typography
              variant="body2"
              component="p"
              className="text-sm font-bold text-primary leading-tight"
            >
              {copy.appName}
            </Typography>
            <Typography
              variant="body3"
              component="p"
              className="text-[0.6rem] text-tertiary leading-tight"
            >
              {copy.tagline}
            </Typography>
          </Box>
        </Link>

        {/* Desktop actions (md+) */}
        <Box className="hidden items-center gap-3 md:flex">
          {/* Balance */}
          {session?.user && (
            <Typography
              variant="body3"
              component="span"
              className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-semibold text-secondary"
            >
              {copy.balance}: S/ {balance.toFixed(2)}
            </Typography>
          )}

          {/* Auth */}
          {session?.user ? (
            <AvatarMenu />
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" rounded="full">
                {copy.login}
              </Button>
            </Link>
          )}
        </Box>

        {/* Mobile actions */}
        <Box className="flex items-center gap-2 md:hidden">
          {/* Mobile balance display */}
          {session?.user && (
            <Typography
              variant="body3"
              component="span"
              className="rounded-full bg-surface-secondary px-2 py-1 text-xs font-semibold text-secondary"
            >
              S/ {balance.toFixed(2)}
            </Typography>
          )}

          {/* Mobile auth action */}
          {session?.user ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1 rounded-lg text-primary transition hover:bg-surface-secondary"
              aria-label={copy.menu}
            >
              <span
                className={`block h-0.5 w-4 rounded-full bg-current transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-4 rounded-full bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-4 rounded-full bg-current transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" rounded="full">
                {copy.login}
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      {/* Mobile floating menu overlay */}
      <AnimatePresence>
        {menuOpen && session?.user && (
          <>
            {/* Click-away backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-full z-50 mt-1 w-56 overflow-hidden rounded-radius-lg border border-line-primary bg-surface-primary shadow-lg md:hidden"
            >
              <Box className="flex flex-col gap-2 px-4 py-3">
                {/* Auth */}
                {session?.user ? (
                  <Box className="flex flex-col gap-2">
                    <Box className="flex items-center gap-2 px-1">
                      <Box className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-[0.6rem] font-bold text-inverse">
                        {getInitials(session.user.name, session.user.email)}
                      </Box>
                      <Box>
                        <Typography variant="body3" className="text-sm text-primary truncate">
                          {session.user.name}
                        </Typography>
                        <Typography variant="body3" className="text-xs text-tertiary truncate">
                          {session.user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Link href="/profile" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" /> {copy.profile}
                      </Button>
                    </Link>
                    {/* <Link href="/profile" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                        <ClipboardList className="h-4 w-4" /> {copy.betHistory}
                      </Button>
                    </Link> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="h-4 w-4" /> {copy.logout}
                    </Button>
                  </Box>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      {copy.login}
                    </Button>
                  </Link>
                )}
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
