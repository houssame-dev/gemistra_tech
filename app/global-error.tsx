"use client";

import { colors } from "@/lib/tokens";

const copy = {
  en: {
    code: "Critical error",
    title: "Something went wrong on our end.",
    description: "The application failed to load. Please try again. If the problem persists, email us at",
    retry: "Try again",
    contactEmail: "contact@gemistratech.com",
  },
  fr: {
    code: "Erreur critique",
    title: "Une erreur s'est produite de notre côté.",
    description: "L'application n'a pas pu se charger. Veuillez réessayer. Si le problème persiste, écrivez-nous à",
    retry: "Réessayer",
    contactEmail: "contact@gemistratech.com",
  },
  ar: {
    code: "خطأ حرج",
    title: "حدث خطأ من جانبنا.",
    description: "تعذر تحميل التطبيق. يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، راسلنا على",
    retry: "حاول مرة أخرى",
    contactEmail: "contact@gemistratech.com",
  },
} as const;

type Locale = keyof typeof copy;

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const segment = typeof window === "undefined" ? "en" : window.location.pathname.split("/")[1];
  const locale: Locale = segment === "fr" || segment === "ar" ? segment : "en";
  const text = copy[locale];
  const bodyFont = locale === "ar"
    ? '"Noto Sans Arabic", Tahoma, Arial, sans-serif'
    : '"Inter", Arial, sans-serif';
  const headingFont = locale === "ar"
    ? bodyFont
    : '"Space Grotesk", "Arial Narrow", Arial, sans-serif';

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body style={{ margin: 0, backgroundColor: colors.bg, color: colors.ink, fontFamily: bodyFont }}>
        <style>{`
          .global-error-code { font-size: 0.8125rem; line-height: 1.5; }
          .global-error-title { font-size: 1.875rem; line-height: 1.15; }
          .global-error-description { font-size: 0.9375rem; line-height: 1.65; }
          .global-error-retry:hover { background-color: ${colors.violetDim}; }
          .global-error-retry:focus-visible { outline: 2px solid ${colors.violet}; outline-offset: 2px; }
          @media (min-width: 1024px) {
            .global-error-code { font-size: 0.875rem; }
            .global-error-title { font-size: 2.75rem; }
            .global-error-description { font-size: 1rem; }
          }
        `}</style>
        <main
          id="main-content"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "4rem 1.5rem",
            boxSizing: "border-box",
          }}
        >
          <p className="global-error-code" style={{ color: colors.teal, fontWeight: 500, margin: 0 }}>{text.code}</p>
          <h1 className="global-error-title" style={{ fontFamily: headingFont, fontWeight: 700, margin: "0.75rem 0 0", maxWidth: "36rem" }}>
            {text.title}
          </h1>
          <p className="global-error-description" style={{ color: colors.inkSecondary, margin: "1rem 0 0", maxWidth: "28rem", lineHeight: locale === "ar" ? 1.8 : undefined }}>
            {text.description}{" "}<bdi dir="ltr">{text.contactEmail}</bdi>.
          </p>
          <button
            className="global-error-retry"
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              height: "3rem",
              backgroundColor: colors.violet,
              color: colors.white,
              border: 0,
              padding: "0 1.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer",
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
            }}
          >
            {text.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
