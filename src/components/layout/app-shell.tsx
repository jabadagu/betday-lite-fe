"use client";

import { usePathname } from "next/navigation";

import { Box, Toast } from "@betday/components/ui";
import { BetslipMobile, BetslipFab } from "@betday/components/betslip";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header, Footer } from "@betday/components/layout";
import { LoginModal } from "@betday/components/login-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <Box className="flex min-h-screen flex-col bg-surface-page">
      <Header />
      <Box className="flex-1">{children}</Box>
      <Footer />

      {/* Global overlays */}
      {!isLogin && <BetslipFab />}
      <BetslipMobile />
      <LoginModal />
      <Toast />
      {/* vercel */}
      <Analytics />
      <SpeedInsights />
    </Box>
  );
}
