import { getTranslations } from "next-intl/server";
import { Users, Layers, Shield } from "lucide-react";

const icons = [Users, Layers, Shield] as const;

type Point = {
  stat?: string;
  statLabel?: string;
  title: string;
  description: string;
  details: string[];
};

export default async function WhyUs() {
  const t = await getTranslations("whyUs");
  const points = t.raw("points") as Point[];

  return (
    <section
      id="why-us"
      className="flex min-h-screen items-center border-t border-border bg-surface py-16 lg:py-24"
    >
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-ink-muted">{t("eyebrow")}</p>
          <h2 className="type-section-title mt-3 text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
          <p className="type-lead mx-auto mt-4 max-w-xl text-ink-secondary">{t("intro")}</p>
        </div>

        <div className="mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-4 lg:grid-cols-3">
          {points.map((point, index) => {
            const Icon = icons[index];
            return (
              <div
                key={point.title}
                className={`facet-border facet flex h-full flex-col items-center bg-bg p-6 text-center md:col-span-2 lg:col-span-1 ${
                  points.length % 2 === 1 && index === points.length - 1
                    ? "md:col-start-2 lg:col-start-auto"
                    : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </div>

                {point.stat && point.statLabel && (
                  <>
                    {/* PLACEHOLDER: replace the 30-day support period if the final offer changes. */}
                    <p className="type-small mt-4 font-display font-bold text-ink">
                      {point.stat}
                    </p>
                    <p className="type-small mt-1 font-medium text-ink-muted">
                      {point.statLabel}
                    </p>
                  </>
                )}

                <div className="mx-auto mt-4 h-px w-10 bg-violet" />

                <h3 className="type-card-title mt-4 font-display font-bold text-ink">
                  {point.title}
                </h3>
                <p className="type-body mt-2 text-ink-secondary">
                  {point.description}
                </p>

                <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
                  {point.details.map((detail) => (
                    <li key={detail} className="flex items-start justify-center gap-2 text-center">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
