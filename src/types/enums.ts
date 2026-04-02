/**
 * Bet selection options (1, Draw, 2)
 */
export enum BetSelection {
  HOME = "1",
  DRAW = "X",
  AWAY = "2",
}

/**
 * Available application locales
 */
export enum Locale {
  ES = "es",
  EN = "en",
}

/**
 * Bet status states
 */
export enum BetStatus {
  PENDING = "PENDING",
  WON = "WON",
  LOST = "LOST",
}

/**
 * Bet type options
 */
export enum BetType {
  SIMPLE = "simple",
  MULTIPLE = "multiple",
}
