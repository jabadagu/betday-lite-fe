"use client";

import { usePathname } from "next/navigation";

import { Box } from "@/components/ui/box";
import { Toast } from "@/components/ui/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BetslipMobile, BetslipFab } from "@/components/betslip";
import { LoginModal } from "@/components/login-modal";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
