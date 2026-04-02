import { MatchEvent } from "@/types/event";

const today = new Date();
const baseDate = today.toISOString().slice(0, 10);

const buildTime = (hour: number, minute = 0) =>
  `${baseDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`;

export const dailyEvents: MatchEvent[] = [
  {
    id: "ev-1",
    league: "LaLiga",
    tournament: "Europe",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    startTime: buildTime(14, 0),
    featured: true,
    odds: { home: 2.1, draw: 3.4, away: 2.85 },
  },
  {
    id: "ev-2",
    league: "Premier League",
    tournament: "Europe",
    homeTeam: "Arsenal",
    awayTeam: "Manchester City",
    startTime: buildTime(15, 0),
    featured: true,
    odds: { home: 2.45, draw: 3.25, away: 2.7 },
  },
  {
    id: "ev-3",
    league: "Champions League",
    tournament: "Champions",
    homeTeam: "Inter",
    awayTeam: "Bayern Munich",
    startTime: buildTime(17, 0),
    featured: true,
    odds: { home: 2.3, draw: 3.15, away: 2.95 },
  },
  {
    id: "ev-4",
    league: "Libertadores",
    tournament: "Libertadores",
    homeTeam: "River Plate",
    awayTeam: "Palmeiras",
    startTime: buildTime(19, 0),
    featured: true,
    odds: { home: 2.6, draw: 3.1, away: 2.55 },
  },
  {
    id: "ev-5",
    league: "LaLiga",
    tournament: "Europe",
    homeTeam: "Real Sociedad",
    awayTeam: "Villarreal",
    startTime: buildTime(15, 30),
    odds: { home: 1.95, draw: 3.2, away: 3.85 },
  },
  {
    id: "ev-6",
    league: "Premier League",
    tournament: "Europe",
    homeTeam: "Brighton",
    awayTeam: "Tottenham",
    startTime: buildTime(17, 30),
    odds: { home: 2.25, draw: 3.4, away: 2.9 },
  },
  {
    id: "ev-7",
    league: "Champions League",
    tournament: "Champions",
    homeTeam: "PSG",
    awayTeam: "Atletico Madrid",
    startTime: buildTime(19, 0),
    featured: true,
    odds: { home: 1.85, draw: 3.6, away: 3.9 },
  },
  {
    id: "ev-8",
    league: "Bundesliga",
    tournament: "Europe",
    homeTeam: "Leipzig",
    awayTeam: "Leverkusen",
    startTime: buildTime(21, 0),
    odds: { home: 2.8, draw: 3.55, away: 2.3 },
  },
  {
    id: "ev-9",
    league: "Libertadores",
    tournament: "Libertadores",
    homeTeam: "Flamengo",
    awayTeam: "Boca Juniors",
    startTime: buildTime(21, 30),
    featured: true,
    odds: { home: 2.15, draw: 3.2, away: 3.05 },
  },
  {
    id: "ev-10",
    league: "LaLiga",
    tournament: "Europe",
    homeTeam: "Atletico Madrid",
    awayTeam: "Sevilla",
    startTime: buildTime(22, 0),
    odds: { home: 1.75, draw: 3.5, away: 4.2 },
  },
];

export const eventById = new Map(dailyEvents.map((event) => [event.id, event]));
