import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Quote, User } from "lucide-react";
import { testimonials } from "@/lib/testimonials";
import type { SectionTone } from "@/lib/config";

type TestimonialCopy = {
  clientName: string;
  roleCompany: string;
  quote: string;
};

export default async function Testimonials({ tone = "bg" }: { tone?: SectionTone }) {
  const t = await getTranslations("testimonials");
  const tData = await getTranslations("testimonialData");

  return (
    <section id="testimonials" className={`flex min-h-screen items-center border-t border-border py-16 lg:py-24 ${tone === "bg" ? "bg-bg" : "bg-surface"}`}>
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
          <p className="type-lead mx-auto mt-4 max-w-xl text-ink-secondary">{t("description")}</p>
        </div>

        <div className="mx-auto mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {testimonials.map((testimonial, index) => {
            const copy = tData.raw(testimonial.messageKey) as TestimonialCopy;
            const centerOrphan = testimonials.length % 2 === 1 && index === testimonials.length - 1;

            return (
              <article
                key={testimonial.id}
                className={`facet-border facet flex h-full flex-col p-8 sm:col-span-2 ${tone === "bg" ? "bg-surface" : "bg-bg"} ${centerOrphan ? "sm:col-start-2 lg:col-start-3" : ""}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-soft text-violet">
                  <Quote size={24} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <blockquote className="type-body mt-6 flex-1 text-ink-secondary">
                  {copy.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                  <div className="facet-sm relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-elevated text-ink-muted">
                    {testimonial.image ? (
                      <Image src={testimonial.image} alt="" fill sizes="48px" className="object-cover" />
                    ) : (
                      <User size={24} strokeWidth={1.75} aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <h3 className="type-card-title font-display font-bold text-ink">{copy.clientName}</h3>
                    <p className="mt-2 text-sm text-ink-secondary">{copy.roleCompany}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
