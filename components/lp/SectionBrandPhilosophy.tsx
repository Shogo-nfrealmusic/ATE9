import type { BrandPhilosophyContent } from '@/types/landing';
import type { JSX } from 'react';

const closingVariantClassMap: Record<
  NonNullable<BrandPhilosophyContent['closingDescriptionParts'][number]['variant']>,
  string
> = {
  default: 'text-white/70',
  primary: 'text-white font-semibold',
  accent: 'text-ate9-red font-semibold',
};

const pickText = (value: { ja: string; en: string }, locale: 'ja' | 'en'): string =>
  locale === 'en' ? value.en || value.ja : value.ja;

const pickOptionalText = (
  value: { ja: string; en: string } | undefined,
  locale: 'ja' | 'en',
): string => (value ? pickText(value, locale) : '');

export type SectionBrandPhilosophyProps = {
  content: BrandPhilosophyContent;
  locale: 'ja' | 'en';
};

export function SectionBrandPhilosophy({
  content,
  locale,
}: SectionBrandPhilosophyProps): JSX.Element {
  const heading = pickText(content.heading, locale);
  const subheading = pickText(content.subheading, locale);
  const introHeading = pickText(content.introHeading, locale);
  const structureLabel = pickText(content.structureLabel, locale);
  const structureDescription = pickText(content.structureDescription, locale);
  const closingTitle = pickText(content.closingTitle, locale);
  const summaryLabel = pickText(content.summaryLabel, locale);
  const summaryDescription = pickText(content.summaryDescription, locale);
  const summarySupportingText = pickText(content.summarySupportingText, locale);
  const summaryItemsLabel = pickText(content.summaryItemsLabel, locale);
  const coreValuesLabel = pickText(content.coreValuesLabel, locale);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="brand-philosophy">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-stretch gap-12 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16 lg:py-16">
          <div className="space-y-10 lg:space-y-12">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-3xl lg:text-4xl">
                {heading}
              </h2>
              <div className="h-0.5 w-16 bg-ate9-red" />
              <p className="text-xs text-white/60 md:text-sm whitespace-pre-line">{subheading}</p>
            </div>

            <div className="space-y-5">
              <p className="text-2xl font-semibold leading-relaxed tracking-[-0.02em] text-white md:text-3xl lg:text-4xl">
                {introHeading}
              </p>
              <div className="space-y-3 text-sm leading-relaxed text-white/70 sm:text-base whitespace-pre-line">
                {content.introParagraphs.map((paragraph, index) => (
                  <p key={`intro-${index}`}>{pickText(paragraph, locale)}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 md:text-sm">
                {structureLabel}
              </h3>
              <p className="max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base whitespace-pre-line">
                {structureDescription}
              </p>

              <div className="relative pl-6 space-y-5">
                <div className="absolute left-0 top-1.5 h-full w-px bg-ate9-red/40" />

                {content.structureItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ate9-red" />
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-white md:text-base">
                          <span className="text-ate9-red">{item.label}</span>{' '}
                          {pickText(item.title, locale)}
                        </p>
                        {item.subDescription ? (
                          <p className="text-xs text-white/70 whitespace-pre-line">
                            {pickOptionalText(item.subDescription, locale)}
                          </p>
                        ) : null}
                        <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
                          {pickText(item.description, locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-ate9-gray/40 pt-4">
              <p className="text-base font-semibold leading-relaxed text-white sm:text-lg">
                {closingTitle}
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
                {content.closingDescriptionParts.map((part) => (
                  <span
                    key={part.id}
                    className={`${closingVariantClassMap[part.variant ?? 'default']} mr-1 inline-block whitespace-pre-line`}
                  >
                    {pickText(part.text, locale)}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <aside className="flex h-full flex-col justify-between gap-10 lg:pl-10">
            <div className="space-y-4">
              {summaryLabel ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {summaryLabel}
                </p>
              ) : null}
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-white/80 sm:text-base whitespace-pre-line">
                  {summaryDescription}
                </p>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base whitespace-pre-line">
                  {summarySupportingText}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {summaryItemsLabel ? (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  {summaryItemsLabel}
                </p>
              ) : null}
              <div className="space-y-3 text-xs text-white/70 sm:text-sm">
                {content.summaryItems.map((item) => (
                  <div key={item.id}>
                    <p className="text-sm font-semibold text-white">
                      <span className="text-ate9-red">{item.label}</span>{' '}
                      {pickText(item.title, locale)}
                    </p>
                    <p className="whitespace-pre-line">{pickText(item.description, locale)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                {coreValuesLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {content.coreValues.map((value, index) => (
                  <span
                    key={`core-value-${index}`}
                    className="inline-flex items-center rounded-full border border-ate9-gray/50 bg-transparent px-3 py-1 text-[11px] text-white/70 sm:text-xs"
                  >
                    {pickText(value, locale)}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
