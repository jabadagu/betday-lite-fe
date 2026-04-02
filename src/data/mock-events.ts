import { MatchEvent } from "@betday/types";

const leagues = [
  { league: "LaLiga", tournament: "Europe" },
  { league: "Premier League", tournament: "Europe" },
  { league: "Champions League", tournament: "Champions" },
  { league: "Bundesliga", tournament: "Europe" },
  { league: "Libertadores", tournament: "Libertadores" },
  { league: "Serie A", tournament: "Europe" },
  { league: "Ligue 1", tournament: "Europe" },
  { league: "MLS", tournament: "Americas" },
];

const teamPairs = [
  ["Real Madrid", "Barcelona"],
  ["Arsenal", "Manchester City"],
  ["Inter", "Bayern Munich"],
  ["Leipzig", "Leverkusen"],
  ["River Plate", "Palmeiras"],
  ["Juventus", "Milan"],
  ["PSG", "Marseille"],
  ["LAFC", "Inter Miami"],
  ["Atletico Madrid", "Sevilla"],
  ["Chelsea", "Liverpool"],
  ["Borussia Dortmund", "Stuttgart"],
  ["Flamengo", "Boca Juniors"],
  ["Napoli", "Roma"],
  ["Monaco", "Lyon"],
  ["New York City", "Seattle Sounders"],
  ["Real Sociedad", "Villarreal"],
  ["Tottenham", "Brighton"],
  ["Sporting", "Benfica"],
  ["Celtic", "Rangers"],
  ["Ajax", "PSV"],
];

const baseDate = new Date();

const buildDateTime = (dayOffset: number, hour: number, minute = 0) => {
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const buildOdd = (base: number, variation: number) => Number((base + variation).toFixed(2));

export const dailyEvents: MatchEvent[] = Array.from({ length: 20 }, (_, dayOffset) =>
  Array.from({ length: 10 }, (_, matchIndex) => {
    const globalIndex = dayOffset * 10 + matchIndex + 1;
    const leagueIndex = (dayOffset + matchIndex) % leagues.length;
    const teamIndex = (dayOffset * 10 + matchIndex) % teamPairs.length;
    const [homeTeam, awayTeam] = teamPairs[teamIndex];
    const { league, tournament } = leagues[leagueIndex];
    const hour = 12 + matchIndex * 2 + (matchIndex >= 4 ? 1 : 0);
    const minute = matchIndex % 2 === 0 ? 0 : 30;
    const oddSeed = ((dayOffset + 1) * (matchIndex + 3)) % 7;

    return {
      id: `ev-${String(globalIndex).padStart(3, "0")}`,
      league,
      tournament,
      homeTeam,
      awayTeam,
      startTime: buildDateTime(dayOffset, hour, minute),
      featured: matchIndex < 3,
      odds: {
        home: buildOdd(1.55, oddSeed * 0.17),
        draw: buildOdd(2.95, oddSeed * 0.12),
        away: buildOdd(2.25, oddSeed * 0.19),
      },
    } satisfies MatchEvent;
  }),
).flat();

export const eventById = new Map(dailyEvents.map((event) => [event.id, event]));
