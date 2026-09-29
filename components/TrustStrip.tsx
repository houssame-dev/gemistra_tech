import { getTranslations } from "next-intl/server";
import Image from "next/image";

const CLIENT_LOGOS = Array.from({ length: 10 }, (_, i) => ({
  id: `logo-${i + 1}`,
  src: `/logos/logo-${i + 1}.png`,
}));

function LogoFrame({
  logo,
  alt,
}: {
  logo: (typeof CLIENT_LOGOS)[number];
  alt: string;
}) {
  return (
    <div className="facet-border facet-sm group/frame flex shrink-0 items-center justify-center bg-bg p-6 transition-colors duration-75 ease-linear hover:bg-elevated">
      <Image
        src={logo.src}
        alt={alt}
        width={200}
        height={200}
        className="h-16 w-auto object-contain grayscale opacity-60 transition-all duration-75 ease-linear group-hover/frame:grayscale-0 group-hover/frame:opacity-100"
        draggable={false}
      />
    </div>
  );
}

export default async function TrustStrip() {
  const t = await getTranslations("trustedBy");

  return (
    <section className="flex min-h-screen flex-col justify-center border-t border-border bg-surface py-16 lg:py-24">
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("heading")}
          </h2>
        </div>
      </div>

      <div className="container-page relative mt-12 overflow-hidden border-y border-border bg-surface/60">
        {/* Logical edge fades keep the treatment correct in both LTR and RTL. */}
        <div
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-20 bg-gradient-to-r from-surface to-transparent rtl:bg-gradient-to-l sm:w-28 lg:w-36"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-20 bg-gradient-to-l from-surface to-transparent rtl:bg-gradient-to-r sm:w-28 lg:w-36"
          aria-hidden="true"
        />

        <div className="marquee-group py-8">
          <div className="marquee flex w-max items-center">
            <div className="flex shrink-0 items-center gap-8 pe-8">
              {CLIENT_LOGOS.map((logo, index) => (
                <LogoFrame
                  key={logo.id}
                  logo={logo}
                  alt={t("logoAlt", { number: index + 1 })}
                />
              ))}
            </div>
            <div aria-hidden="true" className="flex shrink-0 items-center gap-8 pe-8">
              {CLIENT_LOGOS.map((logo) => (
                <LogoFrame key={`dup-${logo.id}`} logo={logo} alt="" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
