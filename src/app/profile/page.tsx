import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { BetList } from "@betday/components/bet-list";
import { authOptions } from "@betday/lib/auth";
import { getBetsByUser } from "@betday/services/bets.service";
import { ProfileShell } from "./profile-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Perfil | BetDay",
  description: "Gestiona tu perfil y revisa tu historial de apuestas en BetDay.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const bets = await getBetsByUser(session.user.id);
  const activeBets = bets.filter((bet) => bet.status === "PENDING");
  const historyBets = bets.filter((bet) => bet.status !== "PENDING");

  return (
    <ProfileShell
      name={session.user.name ?? ""}
      email={session.user.email ?? ""}
      totalBets={bets.length}
      activeBets={activeBets}
    >
      <BetList bets={historyBets} />
    </ProfileShell>
  );
}
