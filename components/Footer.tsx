import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// PLACEHOLDER: replace these social URLs with the official profiles before launch.
const socials = [
  { Icon: LinkedinIcon, href: "https://linkedin.com/company/gemistra", platform: "LinkedIn" },
  { Icon: InstagramIcon, href: "https://instagram.com/gemistra", platform: "Instagram" },
  { Icon: XIcon, href: "https://x.com/gemistra", platform: "X / Twitter" },
  { Icon: FacebookIcon, href: "https://facebook.com/gemistra", platform: "Facebook" },
];

type ServiceItem = {
  name: string;
  tag: string;
  description: string;
  deliverables: string[];
};

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tServices = await getTranslations("services");
  const tLanguage = await getTranslations("language");
  const tCommon = await getTranslations("common");
  const contactEmail = tCommon("contactEmail");

  const links = [
    { href: "/#services" as const, label: tNav("services") },
    { href: "/#why-us" as const, label: tNav("whyUs") },
    { href: "/#process" as const, label: tNav("process") },
    { href: "/#team" as const, label: tNav("team") },
    { href: "/#work" as const, label: tNav("work") },
    { href: "/#contact" as const, label: tNav("contact") },
  ];

  const services = tServices.raw("items") as ServiceItem[];

  return (
    <footer className="border-t border-border bg-bg">
      <div className="container-page grid grid-cols-1 gap-12 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo imageClassName="h-8 w-auto" />
          <p className="type-small mt-4 max-w-xs text-ink-secondary">{t("tagline")}</p>
        </div>

        <nav aria-label={t("navLabel")}>
          <p className="type-small font-medium text-ink">{t("quickLinks")}</p>
          <ul className="type-small mt-4 space-y-2 text-ink-secondary">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="focus-ring hover:text-ink">{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="type-small font-medium text-ink">{t("services")}</p>
          <ul className="type-small mt-4 space-y-2 text-ink-secondary">
            {services.map((service) => (
              <li key={service.name}>
                <Link href="/#services" className="focus-ring hover:text-ink">{service.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-small font-medium text-ink">{t("contact")}</p>
          <a dir="ltr" href={"mailto:" + contactEmail}
            className="type-small mt-4 block text-ink-secondary hover:text-teal focus-ring">
            {contactEmail}
          </a>

          <p className="type-small mt-6 font-medium text-ink">{tNav("followUs")}</p>
          <div className="mt-3 flex gap-2">
            {socials.map(({ Icon, href, platform }) => (
              <a key={platform} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={t("socialOn", { platform })}
                className="facet-border facet-sm focus-ring flex h-11 w-11 shrink-0 items-center justify-center bg-elevated text-ink-muted hover:text-violet">
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="type-small mt-6 font-medium text-ink">{tLanguage("label")}</p>
          <LanguageSwitcher className="mt-3" />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center gap-4 py-6 md:flex-row md:justify-between">
          <p className="type-small text-ink-muted">{t("copyright", { year: new Date().getFullYear() })}</p>
          <nav aria-label={t("legalLabel")}>
            <ul className="type-small flex items-center gap-4 text-ink-secondary">
              <li>
                <Link href="/privacy" className="focus-ring hover:text-ink">{tNav("privacyPolicy")}</Link>
              </li>
              <li>
                <Link href="/terms" className="focus-ring hover:text-ink">{tNav("termsOfService")}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
