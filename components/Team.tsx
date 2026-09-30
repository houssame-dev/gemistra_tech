import { getTranslations, getLocale } from "next-intl/server";
import TeamCarousel from "./TeamCarousel";
import type { SectionTone } from "@/lib/config";

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  filled: boolean;
  image?: string;
};

type SocialEntry = { platform: string; href: string; ariaLabel: string };

export default async function Team({ tone = "surface" }: { tone?: SectionTone }) {
  const t = await getTranslations("team");
  const locale = await getLocale();
  const members = t.raw("members") as TeamMember[];

  const socialOn = (name: string, platform: string) => t("socialOn", { name, platform });

  // PLACEHOLDER: replace these social URLs with the final member profiles before launch.
  const memberSocialDefinitions = [
    [
      { platform: "linkedin", href: "https://linkedin.com/in/houssame-errjem", platformLabel: "LinkedIn" },
      { platform: "x", href: "https://x.com/houssame_errjem", platformLabel: "X / Twitter" },
    ],
    [{ platform: "linkedin", href: "https://linkedin.com/company/gemistra", platformLabel: "LinkedIn" }],
    [],
    [],
    [],
  ];
  const memberSocials: SocialEntry[][] = memberSocialDefinitions.map((entries, index) =>
    entries.map(({ platform, href, platformLabel }) => ({
      platform,
      href,
      ariaLabel: socialOn(members[index].name, platformLabel),
    }))
  );

  return (
    <section id="team" className={`flex min-h-screen items-center border-t border-border py-16 lg:py-24 ${tone === "bg" ? "bg-bg" : "bg-surface"}`}>
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mt-12">
          <TeamCarousel
            members={members}
            hiringBadge={t("hiringBadge")}
            openPositionLabel={t("openPositionLabel")}
            previousLabel={t("previousLabel")}
            nextLabel={t("nextLabel")}
            socials={memberSocials}
            locale={locale}
            tone={tone}
          />
        </div>
      </div>
    </section>
  );
}
