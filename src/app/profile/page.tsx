import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { BetList } from "@/components/bet-list";
import { authOptions } from "@/lib/auth";
import { getBetsByUser } from "@/services/bets.service";
import { ProfileShell } from "./profile-shell";

export const dynamic = "force-dynamic";

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
