export type MatchOdds = {
  home: number;
  draw: number;
  away: number;
};

export type MatchEvent = {
  id: string;
  league: string;
  tournament: string;
  startTime: string;
  homeTeam: string;
  awayTeam: string;
  featured?: boolean;
  odds: MatchOdds;
};
