import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ScrollReveal";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SHOW_TRUST_STRIP, type SectionTone } from "@/lib/config";

type Props = {
  params: { locale: string };
};

const SITE_URL = "https://gemistratech.com";

function getOrganizationSchema(brandName: string, city: string, contactType: string) {
  return {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brandName,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon-32x32.png`,
  email: "contact@gemistratech.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: city,
    addressCountry: "MA",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "contact@gemistratech.com",
      contactType,
      areaServed: "MA",
      availableLanguage: ["en", "fr", "ar"],
    },
  ],
  // PLACEHOLDER: replace these social URLs with the official profiles before launch.
  sameAs: [
    "https://linkedin.com/company/gemistra",
    "https://instagram.com/gemistra",
    "https://x.com/gemistra",
    "https://facebook.com/gemistra",
  ],
  };
}

function getLocalBusinessSchema(brandName: string, city: string, region: string) {
  return {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: brandName,
  url: SITE_URL,
  image: `${SITE_URL}/favicon-32x32.png`,
  email: "contact@gemistratech.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: city,
    addressRegion: region,
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.5731,
    longitude: -7.6899,
  },
  openingHours: "Mo-Fr 09:00-18:00",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fr: "/fr",
        ar: "/ar",
        "x-default": "/en",
      },
    },
  };
}

export default async function Home({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const tCommon = await getTranslations("common");
  const tMetadata = await getTranslations("metadata");
  const organizationSchema = getOrganizationSchema(
    tCommon("brandName"),
    tMetadata("schemaCity"),
    tMetadata("schemaContactType")
  );
  const localBusinessSchema = getLocalBusinessSchema(
    tCommon("brandName"),
    tMetadata("schemaCity"),
    tMetadata("schemaRegion")
  );
  const tone = (withTrustStrip: SectionTone, withoutTrustStrip: SectionTone) =>
    SHOW_TRUST_STRIP ? withTrustStrip : withoutTrustStrip;

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      {SHOW_TRUST_STRIP && (
        <ScrollReveal>
          <TrustStrip />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <Services tone={tone("bg", "surface")} />
      </ScrollReveal>
      <ScrollReveal>
        <WhyUs tone={tone("surface", "bg")} />
      </ScrollReveal>
      <ScrollReveal>
        <Process tone={tone("bg", "surface")} />
      </ScrollReveal>
      <ScrollReveal>
        <Team tone={tone("surface", "bg")} />
      </ScrollReveal>
      <ScrollReveal>
        <Testimonials tone={tone("bg", "surface")} />
      </ScrollReveal>
      <ScrollReveal>
        <Work tone={tone("surface", "bg")} />
      </ScrollReveal>
      <ScrollReveal>
        <FAQ tone={tone("bg", "surface")} />
      </ScrollReveal>
      <ScrollReveal>
        <Contact tone={tone("surface", "bg")} />
      </ScrollReveal>
    </main>
  );
}
