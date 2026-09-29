import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Calendar, Folder } from "lucide-react";
import { projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

type ProjectCopy = {
  name: string;
  category: string;
  summary: string;
  description: string;
  services: string[];
};

export default async function Work() {
  const t = await getTranslations("work");
  const tProjects = await getTranslations("projectData");

  return (
    <section id="work" className="flex min-h-screen items-center border-t border-border bg-surface py-16 lg:py-24">
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              copy={tProjects.raw(project.messageKey) as ProjectCopy}
              t={t}
              centerOrphan={projects.length % 2 === 1 && index === projects.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  copy,
  t,
  centerOrphan,
}: {
  project: Project;
  copy: ProjectCopy;
  t: Awaited<ReturnType<typeof getTranslations>>;
  centerOrphan: boolean;
}) {
  return (
    <article
      className={`facet-border facet flex h-full flex-col overflow-hidden bg-bg sm:col-span-2 ${
        centerOrphan ? "sm:col-start-2 lg:col-start-3" : ""
      }`}
    >
      <div
        className="flex aspect-video items-center justify-center bg-gradient-to-br from-elevated to-surface"
        aria-hidden="true"
      >
        <Folder size={32} strokeWidth={1.5} className="text-ink-muted" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="type-small font-medium text-teal">
            {copy.category}
          </span>
          <span className="facet-sm border border-border bg-elevated px-2 py-1 text-xs font-medium text-ink-muted">
            {t(`status.${project.statusKey}`)}
          </span>
        </div>

        <h3 className="type-card-title mt-3 font-display font-bold text-ink">
          {copy.name}
        </h3>
        <p className="type-body mt-2 line-clamp-2 flex-1 text-ink-secondary">
          {copy.summary}
        </p>

        {copy.services.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.services.map((service) => (
              <span
                key={service}
                className="facet-sm border border-border bg-elevated px-2 py-1 text-xs text-ink-muted"
              >
                {service}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <span className="type-small flex items-center gap-2 text-ink-muted">
            <Calendar size={12} strokeWidth={1.5} aria-hidden="true" />
            {project.year}
          </span>
          <Link
            href={`/projects/${project.slug}`}
            className="type-button facet focus-ring inline-flex h-12 items-center justify-center border border-border-hover px-6 font-medium text-ink hover:border-teal hover:text-teal"
          >
            {t("viewProject")}
          </Link>
        </div>
      </div>
    </article>
  );
}
