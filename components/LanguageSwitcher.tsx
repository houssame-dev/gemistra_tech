"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export default function LanguageSwitcher({ className = "", compact = false }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("label")}
      className={`type-small flex items-center ${compact ? "gap-0" : "gap-1"} font-medium ${className}`}
    >
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className="text-ink-muted">
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={loc}
            className={
              loc === locale
                ? "text-violet focus-ring"
                : "text-ink-muted hover:text-ink focus-ring"
            }
          >
            {localeLabels[loc]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
