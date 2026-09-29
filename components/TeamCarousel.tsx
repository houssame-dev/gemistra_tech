"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import Image from "next/image";
import type { TeamMember } from "./Team";

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const iconMap = { linkedin: LinkedinIcon, x: XIcon } as const;

type SocialEntry = { platform: string; href: string; ariaLabel: string };

type Props = {
  members: TeamMember[];
  hiringBadge: string;
  openPositionLabel: string;
  previousLabel: string;
  nextLabel: string;
  socials: SocialEntry[][];
  locale: string;
};

type CarouselButtonProps = {
  direction: "previous" | "next";
  isRtl: boolean;
  label: string;
  disabled: boolean;
  onClick: () => void;
};

function CarouselButton({ direction, isRtl, label, disabled, onClick }: CarouselButtonProps) {
  const pointsRight = isRtl ? direction === "previous" : direction === "next";
  const Icon = pointsRight ? ChevronRight : ChevronLeft;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="carousel-button facet-border facet-sm focus-ring flex h-12 w-12 shrink-0 items-center justify-center bg-bg text-ink transition-colors duration-75 ease-linear disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

export default function TeamCarousel({
  members,
  hiringBadge,
  openPositionLabel,
  previousLabel,
  nextLabel,
  socials,
  locale,
}: Props) {
  const isRtl = locale === "ar";
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: isRtl ? "rtl" : "ltr",
    slidesToScroll: 1,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const syncButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrevious(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncButtons();
    emblaApi.on("select", syncButtons);
    emblaApi.on("reInit", syncButtons);

    return () => {
      emblaApi.off("select", syncButtons);
      emblaApi.off("reInit", syncButtons);
    };
  }, [emblaApi, syncButtons]);

  const previousButton = (
    <CarouselButton
      direction="previous"
      isRtl={isRtl}
      label={previousLabel}
      disabled={!canScrollPrevious}
      onClick={() => emblaApi?.scrollPrev()}
    />
  );
  const nextButton = (
    <CarouselButton
      direction="next"
      isRtl={isRtl}
      label={nextLabel}
      disabled={!canScrollNext}
      onClick={() => emblaApi?.scrollNext()}
    />
  );

  return (
    <div className="relative mx-auto w-full">
      <div className="relative">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container items-stretch gap-5">
            {members.map((member, index) => {
              return (
                <div
                  key={member.name}
                  className="embla__slide flex h-auto w-team-card shrink-0"
                >
                  <div
                    className={`facet relative flex h-full w-full flex-col bg-bg p-6 ${
                      member.filled
                        ? "facet-border"
                        : "border border-dashed border-border-hover"
                    }`}
                  >
                    <div className="facet-sm relative aspect-[4/5] w-full shrink-0 overflow-hidden border border-border bg-elevated">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-full w-full items-center justify-center bg-elevated"
                        >
                          <User size={24} strokeWidth={1.75} className="text-ink-muted" />
                        </div>
                      )}
                    </div>

                    {!member.filled && (
                      <p className="mt-4 text-sm font-medium text-teal">
                        {openPositionLabel}
                      </p>
                    )}

                    <h3 className={`type-card-title font-display font-bold text-ink ${member.filled ? "mt-4" : "mt-2"}`}>
                      {member.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-violet">{member.role}</p>
                    <p className="mt-4 line-clamp-3 text-sm leading-normal text-ink-secondary">
                      {member.bio}
                    </p>

                    {socials[index]?.length > 0 && (
                      <div className="mt-6 flex gap-2">
                        {socials[index].map(({ platform, href, ariaLabel }) => {
                          const Icon = iconMap[platform as keyof typeof iconMap];
                          if (!Icon) return null;
                          return (
                            <a
                              key={platform}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={ariaLabel}
                              className="facet-sm focus-ring flex h-11 w-11 items-center justify-center border border-border bg-elevated text-ink-muted hover:border-violet hover:text-violet"
                            >
                              <Icon size={16} />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {!member.filled && (
                      <p className="facet-sm mt-auto self-start border border-border px-2 py-1 text-xs font-medium text-ink-muted">
                        {hiringBadge}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-12 bg-gradient-to-r from-surface to-transparent rtl:bg-gradient-to-l md:w-16"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-l from-surface to-transparent rtl:bg-gradient-to-r md:w-16"
        />

        <div className="hidden md:block">
          <div className="absolute -start-4 top-1/2 z-20 -translate-y-1/2">
            {previousButton}
          </div>
          <div className="absolute -end-4 top-1/2 z-20 -translate-y-1/2">
            {nextButton}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
}
