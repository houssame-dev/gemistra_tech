import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg bg-facet-glow">
      <div className="container-page flex flex-col items-center gap-8 py-16 text-center lg:gap-12 lg:py-24">
        <h1 className="type-hero max-w-3xl text-balance font-display font-bold tracking-tight text-ink lg:max-w-4xl xl:max-w-5xl">
          {t("title")}{" "}
          <span className="text-violet">{t("titleAccent")}</span>
        </h1>

        <p className="type-lead max-w-xl text-balance text-ink-secondary">
          {t("description")}
        </p>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          <a
            href="#contact"
            className="facet flex h-12 items-center justify-center bg-violet px-6 text-base font-medium leading-none text-white hover:bg-violet-dim focus-ring"
          >
            {t("ctaPrimary")}
          </a>
          <a
            href="#services"
            className="facet flex h-12 items-center justify-center border border-border-hover px-6 text-base font-medium leading-none text-ink hover:border-teal hover:text-teal focus-ring"
          >
            {t("ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
