import { NextResponse } from "next/server";

import { dailyEvents } from "@/data/mock-events";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ events: dailyEvents });
}
