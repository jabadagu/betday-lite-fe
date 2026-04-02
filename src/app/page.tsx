import { dailyEvents } from "@/data/mock-events";
import { HomeClient } from "@/components/home-client";

export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeClient events={dailyEvents} />;
}
