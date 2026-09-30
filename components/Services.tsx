import { getTranslations } from "next-intl/server";
import {
  LayoutDashboard,
  Smartphone,
  Bot,
  MessageSquare,
  Search,
  Globe,
} from "lucide-react";
import type { SectionTone } from "@/lib/config";

const icons = [
  LayoutDashboard,
  Globe,
  Smartphone,
  Bot,
  MessageSquare,
  Search,
] as const;

type ServiceItem = {
  name: string;
  tag: string;
  description: string;
  deliverables: string[];
};

export default async function Services({ tone = "bg" }: { tone?: SectionTone }) {
  const t = await getTranslations("services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <section id="services" className={`flex min-h-screen items-center border-t border-border py-16 lg:py-24 ${tone === "bg" ? "bg-bg" : "bg-surface"}`}>
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-teal">{t("eyebrow")}</p>
          <h2 className="type-section-title mt-3 text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={service.name}
                className={`facet-border facet flex h-full flex-col items-center p-6 text-center ${tone === "bg" ? "bg-surface" : "bg-bg"}`}
              >
                <span className="facet-sm border border-border bg-elevated px-2 py-1 text-xs font-medium text-ink-muted">
                  {service.tag}
                </span>
                <div className="mt-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </div>

                <h3 className="type-card-title mt-4 font-display font-bold text-ink">
                  {service.name}
                </h3>
                <p className="type-body mt-2 text-ink-secondary">
                  {service.description}
                </p>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-secondary">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start justify-center gap-2 text-center">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="type-button facet mt-6 inline-flex h-12 items-center justify-center border border-border-hover px-6 font-medium text-ink hover:border-teal hover:text-teal focus-ring"
                >
                  {t("discussService")}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
