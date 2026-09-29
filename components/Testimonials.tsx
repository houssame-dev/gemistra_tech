import { getTranslations } from "next-intl/server";
import { Quote } from "lucide-react";

export default async function Testimonials() {
  const t = await getTranslations("testimonials");

  return (
    <section id="testimonials" className="flex min-h-screen items-center border-t border-border bg-bg py-16 lg:py-24">
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
          <p className="type-lead mx-auto mt-4 max-w-xl text-ink-secondary">{t("description")}</p>
        </div>

        <div className="facet-border facet mx-auto mt-12 max-w-2xl bg-surface p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-soft text-violet">
            <Quote size={24} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h3 className="type-card-title mt-4 font-display font-bold text-ink">{t("emptyTitle")}</h3>
          <p className="type-body mt-2 text-ink-secondary">
            {t("emptyDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}
