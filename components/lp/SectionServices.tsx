import type { ServicesContent } from '@/types/landing';
import Link from 'next/link';
import type { JSX } from 'react';

type SectionServicesProps = {
  content: ServicesContent;
  locale: 'ja' | 'en';
};

const pickLocalized = (value: { ja: string; en: string }, locale: 'ja' | 'en'): string =>
  locale === 'en' ? value.en || value.ja : value.ja;

export function SectionServices({ content, locale }: SectionServicesProps): JSX.Element {
  const intro = pickLocalized(content.intro, locale);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="services">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] text-white sm:text-4xl">
          Our Services
        </h2>
        {intro ? (
          <p className="mx-auto mt-4 mb-10 max-w-3xl text-center text-sm text-white/70 sm:text-base whitespace-pre-line">
            {intro}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {content.items.map((item) => {
            const title = pickLocalized(item.title, locale);
            const description = pickLocalized(item.description, locale);
            const card = (
              <div className="group relative h-full overflow-hidden rounded-xl bg-ate9-gray p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(242,66,109,0.18)] sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 bg-linear-to-br from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-ate9-red-light">
                    {title}
                  </h3>
                  <span className="h-px w-8 origin-left scale-x-50 bg-ate9-red transition duration-300 group-hover:scale-x-100" />
                  <p className="text-xs leading-relaxed text-white/80 sm:text-sm whitespace-pre-line">
                    {description}
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition group-hover:border-ate9-red/60" />
              </div>
            );

            if (item.slug) {
              const href = { pathname: `/services/${item.slug}`, query: { lang: locale } };
              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label={`${title} の詳細を見る`}
                >
                  {card}
                </Link>
              );
            }

            return (
              <div key={item.id} className="h-full">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
