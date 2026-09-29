import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Space_Grotesk, Inter, Noto_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { getAlternateOpenGraphLocales, openGraphLocales, siteUrl } from "@/lib/metadata";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
  preload: false,
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s — ${tCommon("brandName")}`,
    },
    description: t("description"),
    openGraph: {
      title: tCommon("brandName"),
      description: t("ogDescription"),
      url: siteUrl,
      siteName: tCommon("brandName"),
      locale: openGraphLocales[locale as keyof typeof openGraphLocales],
      alternateLocale: getAlternateOpenGraphLocales(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tCommon("brandName"),
      description: t("ogDescription"),
    },
    manifest: "/site.webmanifest",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tAccessibility = await getTranslations({ locale, namespace: "accessibility" });
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${spaceGrotesk.variable} ${inter.variable} ${
        locale === "ar" ? notoSansArabic.variable : ""
      }`}
    >
      <body className="font-body bg-bg text-ink antialiased">
        <a href="#main-content" className="skip-link facet-sm bg-violet px-4 py-2 text-sm font-medium text-white">
          {tAccessibility("skipToContent")}
        </a>
        <NextIntlClientProvider messages={messages}>
          <CookieConsent />
          <SiteChrome>{children}</SiteChrome>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
