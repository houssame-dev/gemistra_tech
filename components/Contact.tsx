"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import type { SectionTone } from "@/lib/config";

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

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";
// PLACEHOLDER: replace these social URLs with the official profiles before launch.
const socials = [
  { Icon: LinkedinIcon, href: "https://linkedin.com/company/gemistra", platform: "LinkedIn" },
  { Icon: InstagramIcon, href: "https://instagram.com/gemistra", platform: "Instagram" },
  { Icon: XIcon, href: "https://x.com/gemistra", platform: "X / Twitter" },
  { Icon: FacebookIcon, href: "https://facebook.com/gemistra", platform: "Facebook" },
];

type Status = "idle" | "submitting" | "success" | "server-error";
type FieldName = "name" | "email" | "projectType" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

export default function Contact({ tone = "surface" }: { tone?: SectionTone }) {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const contactEmail = tCommon("contactEmail");
  // PLACEHOLDER: replace the translated contactPhone value with the real business number before launch.
  const contactPhone = tCommon("contactPhone");
  const projectTypes = t.raw("projectTypes") as string[];
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  function clearFieldError(field: FieldName) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const projectTypeInput = form.elements.namedItem("project_type") as HTMLSelectElement;
    const messageInput = form.elements.namedItem("message") as HTMLTextAreaElement;
    const errors: FieldErrors = {};

    if (!nameInput.value.trim()) errors.name = t("nameRequired");
    if (!emailInput.value.trim()) {
      errors.email = t("emailRequired");
    } else if (!emailInput.validity.valid) {
      errors.email = t("emailInvalid");
    }
    if (!projectTypeInput.value) errors.projectType = t("projectTypeRequired");
    if (!messageInput.value.trim()) errors.message = t("messageRequired");

    setFieldErrors(errors);
    setStatus("idle");

    const firstInvalidField = Object.keys(errors)[0] as FieldName | undefined;
    if (firstInvalidField) {
      const fieldNames: Record<FieldName, string> = {
        name: "name",
        email: "email",
        projectType: "project_type",
        message: "message",
      };
      window.requestAnimationFrame(() => {
        (form.elements.namedItem(fieldNames[firstInvalidField]) as HTMLElement)?.focus();
      });
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("server-error");
      }
    } catch {
      setStatus("server-error");
    }
  }

  const fieldClass = (field: FieldName, withMargin = true) =>
    "focus-ring " +
    (withMargin ? "mt-2 " : "") +
    "h-12 w-full border bg-elevated px-4 py-3 text-base text-ink " +
    (fieldErrors[field] ? "border-red-400" : "border-border focus:border-violet");

  return (
    <section id="contact" className={`flex min-h-screen items-center border-t border-border py-16 lg:py-24 ${tone === "bg" ? "bg-bg" : "bg-surface"}`}>
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
          <p className="type-lead mx-auto mt-4 max-w-xl text-ink-secondary">{t("intro")}</p>
          <div className="mt-6 flex justify-center">
            <span className="facet-sm inline-flex items-center gap-2 border border-border bg-elevated px-3 py-1 text-xs font-medium text-ink-secondary">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-teal" />
              {t("availability")}
            </span>
          </div>
        </div>

        <div className={`facet-border facet mx-auto mt-12 overflow-hidden ${tone === "bg" ? "bg-surface" : "bg-bg"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col border-b border-border p-6 lg:border-b-0 lg:border-e lg:p-8">
              <p className="text-sm font-medium text-ink">{t("reachUs")}</p>

              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
                    <Mail size={24} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-secondary">{t("email")}</p>
                    <div dir="ltr" className="mt-2">
                      <a href={"mailto:" + contactEmail} className="text-sm text-ink-secondary hover:text-teal focus-ring">
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
                    <Phone size={24} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-secondary">{t("phone")}</p>
                    <a dir="ltr" href={"tel:" + contactPhone.replace(/\s/g, "")} className="mt-2 block text-sm text-ink-secondary hover:text-teal focus-ring">
                      {contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet">
                    <MapPin size={24} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-secondary">{t("location")}</p>
                    <p className="mt-2 text-sm text-ink-secondary">{t("locationValue")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-ink">{t("followUs")}</p>
                <div className="mt-3 flex gap-3">
                  {socials.map(({ Icon, href, platform }) => (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("socialOn", { platform })}
                      className="facet-border facet-sm focus-ring flex h-11 w-11 items-center justify-center bg-elevated text-ink-muted hover:text-violet"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="facet-border facet mt-6 aspect-video w-full overflow-hidden bg-elevated lg:mt-8">
                {!mapLoaded && (
                  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-elevated">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-soft text-violet">
                      <MapPin size={24} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                  </div>
                )}
                <iframe
                  title={t("mapTitle")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108756.93527988697!2d-7.6898842!3d33.5731104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
                  onLoad={() => setMapLoaded(true)}
                  className={"absolute inset-0 h-full w-full border-0 " + (mapLoaded ? "opacity-100" : "opacity-0")}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {status === "success" ? (
              <div role="status" className="flex flex-col items-start justify-center p-6 lg:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-soft text-violet">
                  <Check size={24} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="type-card-title mt-4 font-display font-bold text-ink">{t("success")}</h3>
                <p className="type-body mt-2 text-ink-secondary">
                  {t("successNote")}{" "}
                  <a dir="ltr" href={"mailto:" + contactEmail} className="text-teal underline-offset-2 hover:underline focus-ring">
                    {contactEmail}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="type-button facet focus-ring mt-6 h-12 border border-border-hover px-6 font-medium text-ink hover:border-teal hover:text-teal"
                >
                  {t("sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-6 lg:p-8" noValidate>
                <p className="text-sm font-medium text-ink">{t("sendMessage")}</p>

                <div>
                  <label htmlFor="name" className="block text-sm text-ink-secondary">{t("nameLabel")}</label>
                  <input id="name" name="name" type="text" required
                    aria-invalid={fieldErrors.name ? true : undefined}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    onChange={() => clearFieldError("name")}
                    className={fieldClass("name")} placeholder={t("namePlaceholder")} />
                  {fieldErrors.name && <p id="name-error" role="alert" className="mt-2 text-sm text-red-400">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-ink-secondary">{t("emailLabel")}</label>
                  <input id="email" name="email" type="email" required dir="ltr"
                    aria-invalid={fieldErrors.email ? true : undefined}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    onChange={() => clearFieldError("email")}
                    className={fieldClass("email")} placeholder={t("emailPlaceholder")} />
                  {fieldErrors.email && <p id="email-error" role="alert" className="mt-2 text-sm text-red-400">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm text-ink-secondary">{t("projectTypeLabel")}</label>
                  <div className="relative mt-2">
                    <select id="projectType" name="project_type" required
                      aria-invalid={fieldErrors.projectType ? true : undefined}
                      aria-describedby={fieldErrors.projectType ? "project-type-error" : undefined}
                      onChange={() => clearFieldError("projectType")}
                      className={fieldClass("projectType", false) + " appearance-none pe-12"}>
                      <option value="" className="bg-elevated text-ink-muted">{t("projectTypePlaceholder")}</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type} className="bg-elevated text-ink">{type}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true"
                      className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                  </div>
                  {fieldErrors.projectType && <p id="project-type-error" role="alert" className="mt-2 text-sm text-red-400">{fieldErrors.projectType}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-ink-secondary">{t("messageLabel")}</label>
                  <textarea id="message" name="message" required rows={5}
                    aria-invalid={fieldErrors.message ? true : undefined}
                    aria-describedby={fieldErrors.message ? "message-error" : undefined}
                    onChange={() => clearFieldError("message")}
                    className={"focus-ring mt-2 min-h-32 w-full border bg-elevated px-4 py-3 text-base text-ink " +
                      (fieldErrors.message ? "border-red-400" : "border-border focus:border-violet")}
                    placeholder={t("messagePlaceholder")} />
                  {fieldErrors.message && <p id="message-error" role="alert" className="mt-2 text-sm text-red-400">{fieldErrors.message}</p>}
                </div>

                <button type="submit" disabled={status === "submitting"}
                  className="facet focus-ring h-12 w-full bg-violet px-6 text-base font-medium text-white hover:bg-violet-dim disabled:opacity-60">
                  {status === "submitting" ? t("submitting") : t("submit")}
                </button>

                {status === "server-error" && (
                  <p role="alert" className="text-sm text-red-400">
                    {t("serverError")}{" "}
                    <a dir="ltr" href={"mailto:" + contactEmail} className="underline hover:text-ink focus-ring">{contactEmail}</a>.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
