import type { Locale } from "@betday/lib";

export function formatMatchTime(startTime: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(startTime));
}
