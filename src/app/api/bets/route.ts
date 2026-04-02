import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@betday/lib/auth";
import { createSimpleBet, createMultipleBet, getBetsByUser } from "@betday/services/bets.service";
import { createBetSchema } from "@betday/lib";

export const dynamic = "force-dynamic";

/* Get all bets for the authenticated user */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const bets = await getBetsByUser(session.user.id);
  return NextResponse.json({ bets });
}

/* Create a new bet */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createBetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const data = parsed.data;
    const bet =
      data.type === "multiple"
        ? await createMultipleBet(session.user.id, data.selections, data.stake)
        : await createSimpleBet(session.user.id, data.eventId, data.selection, data.stake);

    return NextResponse.json({ bet }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (error instanceof Error && error.message.startsWith("SUPABASE_")) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
