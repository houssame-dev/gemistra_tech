"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FAQ() {
  const t = useTranslations("faq");
  // PLACEHOLDER: These FAQ answers come from the translated `faq.items` keys and require owner review before launch.
  const faqs = t.raw("items") as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="flex min-h-screen items-center border-t border-border bg-bg py-16 lg:py-24">
      <div className="container-page w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-section-title text-balance font-display font-bold tracking-tight text-ink">
            {t("title")}
          </h2>
          <p className="type-small mt-4 text-ink-secondary">{t("placeholderNote")}</p>
        </div>

        <div className="facet-border facet mx-auto mt-12 max-w-2xl divide-y divide-border bg-surface">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            const ChevronIcon = isOpen ? ChevronUp : ChevronDown;

            return (
              <div key={faq.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-6 py-4 text-start focus-ring"
                  >
                    <span className="type-card-title font-display font-medium text-ink">
                      {faq.question}
                    </span>
                    <ChevronIcon
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="shrink-0 text-ink-muted"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-6 pb-4"
                >
                  <p className="type-body max-w-xl text-ink-secondary">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
