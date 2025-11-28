import type { HeroContent } from '@/types/landing';
import Link from 'next/link';
import type { JSX } from 'react';

type SectionHeroProps = {
  content: HeroContent;
};

export function SectionHero({ content }: SectionHeroProps): JSX.Element {
  const headingLines = content.heading.includes('\n')
    ? content.heading.split('\n')
    : [content.heading];
  const subheadingLines = content.subheading.includes('\n')
    ? content.subheading.split('\n')
    : [content.subheading];

  const rawCtaLink = content.ctaLink?.trim() || '#contact';
  const isExternalCta = rawCtaLink.startsWith('http://') || rawCtaLink.startsWith('https://');

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-10"
      id="hero"
    >
      <div className="absolute inset-0 z-0 bg-linear-to-t from-black via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ate9-red-dark/25 blur-3xl opacity-70 animate-pulse" />
      </div>
      <div className="absolute bottom-10 z-0 h-0.5 w-1/3 bg-linear-to-r from-transparent via-ate9-red-dark to-transparent opacity-80" />

      <div className="relative z-10 flex max-w-4xl flex-col gap-6 sm:gap-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {headingLines.map((line, index) => (
            <span key={`${line}-${index}`} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mx-auto max-w-3xl text-sm font-normal leading-relaxed text-white/80 sm:text-base md:text-lg">
          {subheadingLines.map((line, index) => (
            <span key={`${line}-${index}`} className="block">
              {line}
            </span>
          ))}
        </p>

        {content.ctaLabel ? (
          <div className="mt-4 flex justify-center">
            {isExternalCta ? (
              <a
                href={rawCtaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-ate9-red px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-ate9-red/30 transition hover:bg-ate9-red-dark hover:shadow-ate9-red/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              >
                {content.ctaLabel}
              </a>
            ) : (
              <Link
                href={rawCtaLink}
                className="inline-flex w-full items-center justify-center rounded-full bg-ate9-red px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-ate9-red/30 transition hover:bg-ate9-red-dark hover:shadow-ate9-red/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              >
                {content.ctaLabel}
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
