import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@betday/lib/auth";
import { getBetById } from "@betday/services/bets.service";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ betId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { betId } = await params;
  const bet = await getBetById(session.user.id, betId);

  if (!bet) {
    return NextResponse.json({ message: "Bet not found" }, { status: 404 });
  }

  return NextResponse.json({ bet });
}
