import { getTranslations } from "next-intl/server";
import { Phone, FileText, Code2, Rocket } from "lucide-react";
import type { SectionTone } from "@/lib/config";

const icons = [Phone, FileText, Code2, Rocket] as const;

type Step = {
  step: string;
  title: string;
  timeframe: string;
  description: string;
  activities: string[];
};

export default async function Process({ tone = "bg" }: { tone?: SectionTone }) {
  const t = await getTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="process" className={`flex min-h-screen items-center border-t border-border py-16 lg:py-24 ${tone === "bg" ? "bg-bg" : "bg-surface"}`}>
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-teal">{t("eyebrow")}</p>
          <h2 className="type-section-title mt-3 text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={item.step}
                className={`facet-border facet flex h-full flex-col items-center p-6 text-center ${tone === "bg" ? "bg-surface" : "bg-bg"}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="type-card-title flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-soft font-display font-bold text-violet">
                    {item.step}
                  </span>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
                    <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="type-card-title mt-4 font-display font-bold text-ink">
                  {item.title}
                </h3>
                <p className="type-small mt-2 font-medium text-teal">
                  {item.timeframe}
                </p>
                <p className="type-body mt-2 text-ink-secondary">
                  {item.description}
                </p>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-secondary">
                  {item.activities.map((activity) => (
                    <li key={activity} className="flex items-start justify-start gap-2 text-start">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet"
                      />
                      {activity}
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
