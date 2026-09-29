import { routing } from "@/i18n/routing";

export const siteUrl = "https://gemistratech.com";

export const openGraphLocales = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_MA",
} as const;

export function getAlternateOpenGraphLocales(locale: string) {
  return routing.locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => openGraphLocales[candidate]);
}
