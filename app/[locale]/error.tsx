"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-16 text-center lg:py-24"
    >
      <p className="text-sm font-medium text-teal">{t("code")}</p>
      <h1 className="type-section-title mt-3 max-w-xl text-balance font-display font-bold tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="type-body mt-4 max-w-md text-ink-secondary">{t("description")}</p>
      <button
        type="button"
        onClick={reset}
        className="facet focus-ring mt-8 h-12 bg-violet px-6 text-base font-medium text-white hover:bg-violet-dim"
      >
        {t("tryAgain")}
      </button>
    </main>
  );
}
