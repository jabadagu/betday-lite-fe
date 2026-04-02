import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@betday/lib/auth";
import { getServerBaseUrl } from "@betday/lib/server-url";
import { BetDetailClient } from "@betday/components/bets/bet-detail-client";
import { Bet } from "@betday/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detalle de apuesta | BetDay",
  description: "Revisa el detalle de tu apuesta en BetDay.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BetDetailPage({ params }: { params: Promise<{ betId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { betId } = await params;
  const baseUrl = await getServerBaseUrl();
  const requestHeaders = await headers();

  const response = await fetch(`${baseUrl}/api/bets/${betId}`, {
    headers: { cookie: requestHeaders.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("No se pudo cargar el detalle de apuesta");
  }

  const data = (await response.json()) as { bet: Bet };

  return <BetDetailClient bet={data.bet} />;
}
