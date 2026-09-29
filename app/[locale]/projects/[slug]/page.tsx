import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { projects, getProject } from "@/lib/projects";
import { routing } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getAlternateOpenGraphLocales, openGraphLocales, siteUrl } from "@/lib/metadata";

type Props = {
  params: { locale: string; slug: string };
};

type ProjectCopy = {
  name: string;
  category: string;
  summary: string;
  description: string;
  services: string[];
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const project = getProject(slug);
  if (!project) return {};
  const tProjects = await getTranslations({ locale, namespace: "projectData" });
  const copy = tProjects.raw(project.messageKey) as ProjectCopy;
  return {
    title: copy.name,
    description: copy.summary,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        fr: `/fr/projects/${slug}`,
        ar: `/ar/projects/${slug}`,
        "x-default": `/en/projects/${slug}`,
      },
    },
    openGraph: {
      title: copy.name,
      description: copy.summary,
      url: `${siteUrl}/${locale}/projects/${slug}`,
      locale: openGraphLocales[locale as keyof typeof openGraphLocales],
      alternateLocale: getAlternateOpenGraphLocales(locale),
      type: "website",
    },
  };
}

export default async function ProjectPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("project");
  const tWork = await getTranslations("work");
  const tNav = await getTranslations("nav");
  const tProjects = await getTranslations("projectData");
  const copy = tProjects.raw(project.messageKey) as ProjectCopy;

  return (
    <main id="main-content">
      <section className="border-b border-border bg-bg py-16 lg:py-24">
        <div className="container-page">
          <Link
            href="/#work"
            className="facet focus-ring inline-flex h-12 items-center gap-2 border border-border-hover px-6 text-base font-medium text-ink hover:border-teal hover:text-teal"
          >
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.75} aria-hidden="true" />
            {t("backToWork")}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="type-small font-medium text-teal">
              {copy.category}
            </span>
            <span className="type-small text-ink-muted">{project.year}</span>
            <span className="type-small text-ink-muted">·</span>
            <span className="type-small text-ink-muted">
              {tWork(`status.${project.statusKey}`)}
            </span>
          </div>

          <h1 className="type-section-title mt-4 max-w-2xl text-balance font-display font-bold tracking-tight text-ink">
            {copy.name}
          </h1>
          <p className="type-lead mt-4 max-w-xl text-ink-secondary">
            {copy.summary}
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-16 lg:py-24">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="type-card-title font-display font-bold text-ink">
              {t("about")}
            </h2>
            <p className="type-body mt-4 max-w-xl text-ink-secondary">
              {copy.description}
            </p>
          </div>

          <div>
            <h2 className="type-card-title font-display font-bold text-ink">
              {t("services")}
            </h2>
            <ul className="mt-4 space-y-2">
              {copy.services.map((service) => (
                <li
                  key={service}
                  className="facet-sm border border-border bg-bg px-3 py-2 text-sm text-ink-secondary"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="container-page text-center">
          <h2 className="type-section-title font-display font-bold text-ink">
            {t("ctaTitle")}
          </h2>
          <Link
            href="/#contact"
            className="facet focus-ring mt-6 inline-flex h-12 items-center bg-violet px-6 text-base font-medium text-white hover:bg-violet-dim"
          >
            {tNav("startProject")}
          </Link>
        </div>
      </section>
    </main>
  );
}
