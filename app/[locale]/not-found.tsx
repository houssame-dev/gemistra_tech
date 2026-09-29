"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-16 text-center lg:py-24">
      <p className="text-sm font-medium text-teal">{t("code")}</p>
      <h1 className="type-section-title mt-3 max-w-lg text-balance font-display font-bold tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="type-body mt-4 max-w-sm text-ink-secondary">{t("description")}</p>
      <Link
        href="/"
        className="facet focus-ring mt-8 inline-flex h-12 items-center bg-violet px-6 text-base font-medium text-white hover:bg-violet-dim"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
