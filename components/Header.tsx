"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/navigation";
import { ArrowUp, Mail, Menu, Phone, X } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";

const sectionIds = ["services", "why-us", "process", "team", "work", "contact"];

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XBrandIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// PLACEHOLDER: replace these social URLs with the official profiles before launch.
const socials = [
  { Icon: LinkedinIcon, href: "https://linkedin.com/company/gemistra", label: "LinkedIn" },
  { Icon: InstagramIcon, href: "https://instagram.com/gemistra", label: "Instagram" },
  { Icon: XBrandIcon, href: "https://x.com/gemistra", label: "X / Twitter" },
  { Icon: FacebookIcon, href: "https://facebook.com/gemistra", label: "Facebook" },
];

export default function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const contactEmail = tCommon("contactEmail");
  // PLACEHOLDER: replace the translated contactPhone value with the real business number before launch.
  const contactPhone = tCommon("contactPhone");
  const { open, toggle, close } = useMobileMenu();
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuWasOpenRef = useRef(false);

  const links = [
    { href: "/#services" as const, section: "services", label: t("services") },
    { href: "/#why-us" as const, section: "why-us", label: t("whyUs") },
    { href: "/#process" as const, section: "process", label: t("process") },
    { href: "/#team" as const, section: "team", label: t("team") },
    { href: "/#work" as const, section: "work", label: t("work") },
    { href: "/#contact" as const, section: "contact", label: t("contact") },
  ];

  useEffect(() => {
    let frame = 0;

    function update() {
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) {
          current = id;
        }
      }
      setActiveId(current);
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    function updateScrolledState() {
      setScrolled(window.scrollY > 10);
      setShowScrollToTop(window.scrollY > window.innerHeight);
    }

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    if (!open) {
      if (menuWasOpenRef.current) {
        menuWasOpenRef.current = false;
        requestAnimationFrame(() => menuToggleRef.current?.focus());
      }
      return;
    }

    menuWasOpenRef.current = true;
    const focusFrame = requestAnimationFrame(() => {
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
      );
      firstFocusable?.focus();
    });

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const target = event.target;
        if (
          target instanceof Element &&
          (target.closest("#language-menu") ||
            target.closest('[aria-controls="language-menu"][aria-expanded="true"]'))
        ) {
          return;
        }
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !menuRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, [close]);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const blockBackgroundTouch = (event: TouchEvent) => {
      const target = event.target as Node | null;
      const mobileNav = document.getElementById("mobile-nav");
      if (!target || !mobileNav?.contains(target)) event.preventDefault();
    };

    document.addEventListener("touchmove", blockBackgroundTouch, { passive: false });

    return () => {
      document.removeEventListener("touchmove", blockBackgroundTouch);
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
      body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-75 ease-linear ${
        scrolled
          ? "border-border/60 bg-bg/80 backdrop-blur"
          : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between lg:grid lg:h-20 lg:grid-cols-4">
        <Link
          href="/"
          onClick={close}
          className="justify-self-start focus-ring rounded leading-none"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-2 lg:col-span-2 lg:flex lg:justify-self-center xl:gap-4" aria-label={t("mainNav")}>
          {links.map((link) => {
            const isActive = activeId === link.section;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative whitespace-nowrap text-sm focus-ring rounded transition-colors duration-75 ease-linear ${
                  isActive
                    ? "text-violet after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-violet"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 justify-self-end lg:flex-col lg:items-end lg:gap-1 xl:flex-row xl:items-center xl:gap-3">
          <LanguageSwitcher variant="dropdown" compact className="hidden lg:block" />

          <button
            ref={menuToggleRef}
            type="button"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={toggle}
            className="facet-sm flex h-11 w-11 items-center justify-center text-ink-secondary hover:text-ink focus-ring lg:hidden"
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          ref={menuRef}
          id="mobile-nav"
          aria-label={t("mobileNav")}
          className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto border-t border-border bg-bg lg:hidden"
        >
          <div className="container-page flex flex-1 flex-col py-6">
            <LanguageSwitcher variant="dropdown" className="mb-6 self-start" />

            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  aria-current={activeId === link.section ? "true" : undefined}
                  className={`rounded py-3 font-display text-2xl focus-ring ${
                    activeId === link.section
                      ? "text-violet"
                      : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="type-small font-medium text-ink-muted">
                {t("getInTouch")}
              </p>
              <div className="mt-4 space-y-3">
                <a
                  dir="ltr"
                  href={`mailto:${contactEmail}`}
                  onClick={close}
                  className="flex items-center gap-3 text-sm text-ink-secondary hover:text-teal focus-ring rounded"
                >
                  <Mail size={16} strokeWidth={1.5} className="shrink-0 text-violet" aria-hidden="true" />
                  {contactEmail}
                </a>
                <a
                  dir="ltr"
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  onClick={close}
                  className="flex items-center gap-3 text-sm text-ink-secondary hover:text-teal focus-ring rounded"
                >
                  <Phone size={16} strokeWidth={1.5} className="shrink-0 text-violet" aria-hidden="true" />
                  {contactPhone}
                </a>
              </div>
            </div>

            <div className="mt-6">
              <p className="type-small font-medium text-ink-muted">
                {t("followUs")}
              </p>
              <div className="mt-3 flex gap-3">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("socialOn", { platform: label })}
                    onClick={close}
                    className="facet-sm flex h-11 w-11 items-center justify-center border border-border bg-elevated text-ink-muted hover:border-violet hover:text-violet focus-ring"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <Link
              href="/#contact"
              onClick={close}
              className="facet-sm mt-auto flex h-12 items-center justify-center bg-violet px-6 text-center text-base font-medium text-white hover:bg-violet-dim focus-ring"
            >
              {t("startProject")}
            </Link>
          </div>
        </nav>
      )}

      {showScrollToTop && !open && typeof document !== "undefined" && createPortal(
        <button
          type="button"
          aria-label={t("backToTop")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-to-top-button facet-sm fixed end-4 z-40 flex h-12 w-12 items-center justify-center border border-violet/40 bg-bg text-violet hover:bg-violet-soft focus-ring"
        >
          <ArrowUp size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>,
        document.body
      )}
    </header>
  );
}
