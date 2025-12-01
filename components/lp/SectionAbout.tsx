import type { AboutContent } from '@/types/landing';
import type { JSX } from 'react';

type SectionAboutProps = {
  content: AboutContent;
  locale: 'ja' | 'en';
};

const pickText = (value: { ja: string; en: string }, locale: 'ja' | 'en'): string =>
  locale === 'en' ? value.en || value.ja : value.ja;

export function SectionAbout({ content, locale }: SectionAboutProps): JSX.Element {
  const heading = pickText(content.heading, locale);
  const description = pickText(content.description, locale);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="about">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <div className="mx-auto my-2 h-0.5 w-16 bg-ate9-red md:mx-0" />
          <p className="text-sm font-normal leading-relaxed text-white/80 sm:text-base whitespace-pre-line">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64">
            <div
              aria-hidden="true"
              className="absolute inset-0 rotate-45 rounded-3xl border-2 border-ate9-red-dark transition-transform duration-500 hover:-translate-y-1"
            />
            <div
              aria-hidden="true"
              className="absolute inset-4 rotate-45 rounded-3xl border-2 border-ate9-gray/80 transition-transform duration-500 hover:translate-y-1"
            />
            <div
              aria-hidden="true"
              className="absolute inset-8 rotate-45 rounded-3xl border-2 border-ate9-red opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
