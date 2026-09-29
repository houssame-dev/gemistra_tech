"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CONSENT_EVENT, hasAnalyticsConsent } from "@/components/consent";

/**
 * Renders Vercel Analytics only after the visitor accepts non-essential
 * cookies in the CookieConsent banner. Vercel Analytics is cookieless,
 * but this keeps us compliant by default if tracking scripts are added later.
 */
export function AnalyticsGate() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CONSENT_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CONSENT_EVENT, sync);
    };
  }, []);

  return allowed ? <Analytics /> : null;
}
