import type { Locale } from "@betday/lib";

export function formatMatchTime(startTime: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(startTime));
}

export const formatDayLabel = (dayKey: string, locale: Locale) => {
  const [year, month, day] = dayKey.split("-").map(Number);
  const dayDate = new Date(year, month - 1, day);
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((dayDate.getTime() - normalizedToday.getTime()) / 86400000);
  const relative =
    diffDays === 0 ? "Hoy" : diffDays === 1 ? "Mañana" : diffDays === 2 ? "Pasado mañana" : null;

  const formatted = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(dayDate);

  return relative ? `${relative} · ${formatted}` : formatted;
};
