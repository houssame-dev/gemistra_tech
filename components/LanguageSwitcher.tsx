"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Check, ChevronDown } from "lucide-react";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
  variant?: "inline" | "dropdown";
};

export default function LanguageSwitcher({
  className = "",
  compact = false,
  variant = "inline",
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    const currentIndex = routing.locales.indexOf(locale);
    requestAnimationFrame(() => optionRefs.current[currentIndex]?.focus());

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [locale, open]);

  function handleMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const activeIndex = optionRefs.current.findIndex((option) => option === document.activeElement);
    let nextIndex = activeIndex;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = routing.locales.length - 1;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % routing.locales.length;
    if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + routing.locales.length) % routing.locales.length;
    optionRefs.current[nextIndex]?.focus();
  }

  if (variant === "dropdown") {
    return (
      <div ref={rootRef} className={`relative z-50 w-fit ${className}`} onKeyDown={handleMenuKeyDown}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={t("openMenu")}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="language-menu"
          onClick={() => setOpen((current) => !current)}
          className="facet-border facet-sm focus-ring flex h-11 items-center justify-between gap-2 bg-elevated px-4 text-sm font-medium text-ink-secondary hover:text-ink"
        >
          <span>{localeLabels[locale]}</span>
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className={open ? "rotate-180" : ""}
          />
        </button>

        {open && (
          <div className="absolute end-0 top-full z-50 mt-2 w-max min-w-full lg:mt-12 xl:mt-2">
            <div
              id="language-menu"
              data-language-menu
              role="menu"
              aria-label={t("label")}
              className="facet-border facet-sm w-full bg-elevated p-2"
            >
              {routing.locales.map((loc, index) => (
                <Link
                  key={loc}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  href={pathname}
                  locale={loc}
                  role="menuitemradio"
                  aria-checked={loc === locale}
                  onClick={() => setOpen(false)}
                  className={`focus-ring flex min-h-11 items-center justify-between gap-6 px-3 py-2 text-sm font-medium ${
                    loc === locale ? "text-violet" : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  <span>{t(`options.${loc}`)}</span>
                  {loc === locale && <Check size={16} strokeWidth={1.75} aria-hidden="true" />}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <nav
      aria-label={t("label")}
      className={`type-small flex items-center ${compact ? "gap-0" : "gap-1"} font-medium ${className}`}
    >
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className="text-ink-muted">
              |
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
