export type Project = {
  slug: string;
  year: string;
  image?: string;
  messageKey: string;
  statusKey: "Live" | "InProgress" | "ComingSoon";
};

// PLACEHOLDER: replace this example when a real case study is ready.
// Add one structural entry here and one matching block in every message file.
export const projects: Project[] = [
  {
    slug: "example-project",
    year: "2026",
    messageKey: "example-project",
    statusKey: "ComingSoon",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
