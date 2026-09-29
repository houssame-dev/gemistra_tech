export const CONSENT_STORAGE_KEY = "gemistra-cookie-consent";
export const CONSENT_EVENT = "gemistra-consent-change";

export type ConsentValue = "accepted" | "declined";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "accepted";
}

export function saveConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
