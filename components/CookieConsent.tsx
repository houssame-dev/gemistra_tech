"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import {
  CONSENT_STORAGE_KEY,
  getConsent,
  saveConsent,
  type ConsentValue,
} from "@/components/consent";

export default function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_STORAGE_KEY) setVisible(!getConsent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!visible || !bannerRef.current) return;

    const root = document.documentElement;
    const banner = bannerRef.current;
    const updateHeight = () => {
      root.style.setProperty(
        "--cookie-banner-height",
        banner.getBoundingClientRect().height + "px"
      );
    };
    const observer = new ResizeObserver(updateHeight);
    updateHeight();
    observer.observe(banner);

    return () => {
      observer.disconnect();
      root.style.removeProperty("--cookie-banner-height");
    };
  }, [visible]);

  if (!visible) return null;

  function decide(value: ConsentValue) {
    saveConsent(value);
    setVisible(false);
  }

  return (
    <div
      ref={bannerRef}
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg"
    >
      <div className="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie size={24} strokeWidth={1.75} className="shrink-0 text-violet" aria-hidden="true" />
          <p className="max-w-xl text-sm leading-relaxed text-ink-secondary">
            <span className="font-medium text-ink">{t("title")}</span>{" "}
            {t("message")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="type-button facet focus-ring h-11 flex-1 border border-border-hover px-6 font-medium text-ink hover:border-teal hover:text-teal sm:flex-none"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="facet focus-ring h-11 flex-1 bg-violet px-6 text-base font-medium leading-none text-white hover:bg-violet-dim sm:flex-none"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
