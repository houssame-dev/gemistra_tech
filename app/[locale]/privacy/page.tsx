import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAlternateOpenGraphLocales, openGraphLocales, siteUrl } from "@/lib/metadata";

type Props = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: "/en/privacy",
        fr: "/fr/privacy",
        ar: "/ar/privacy",
        "x-default": "/en/privacy",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/privacy`,
      locale: openGraphLocales[locale as keyof typeof openGraphLocales],
      alternateLocale: getAlternateOpenGraphLocales(locale),
      type: "website",
    },
  };
}

/*
 * PLACEHOLDER LEGAL CONTENT — the copy below is generic template text.
 * Have it reviewed by a qualified legal professional before launch.
 */
export default async function PrivacyPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const tCommon = await getTranslations("common");

  return (
    <main id="main-content" className="border-t border-border bg-bg py-16 lg:py-24">
      <div className="container-page max-w-2xl">
        <h1 className="type-section-title font-display font-bold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="type-body mt-4 max-w-xl text-ink-secondary">{t("description")}</p>

        <div className="facet-border facet mt-12 bg-surface p-6 lg:p-8">
          <p className="max-w-xl text-sm font-medium text-ink-secondary">
            {t("note")}
          </p>
        </div>

        <div className="mt-12 max-w-xl space-y-8">
          {[t("content1"), t("content2")].map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="type-body text-ink-secondary">
              {paragraph}
            </p>
          ))}
          <p className="type-body text-ink-secondary">
            {t("content3Before")}{" "}
            <bdi dir="ltr">{tCommon("contactEmail")}</bdi>{" "}
            {t("content3After")}
          </p>
        </div>

        <Link
          href="/#contact"
          className="facet focus-ring mt-12 inline-flex h-12 items-center border border-border-hover px-6 text-base font-medium text-ink hover:border-teal hover:text-teal"
          dir="ltr"
        >
          {tCommon("contactEmail")}
        </Link>
      </div>
    </main>
  );
}
