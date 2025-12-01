'use client';

import type { BreadcrumbItem } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import { useMemo } from 'react';

type Lang = 'ja' | 'en';

type ServiceHeaderProps = {
  locale: Lang;
  breadcrumbs: BreadcrumbItem[];
};

export function ServiceHeader({ locale, breadcrumbs }: ServiceHeaderProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang: Lang = useMemo(() => {
    const fromQuery = searchParams.get('lang');
    if (fromQuery === 'ja' || fromQuery === 'en') {
      return fromQuery;
    }
    return locale;
  }, [searchParams, locale]);

  const updateLang = (lang: Lang) => {
    if (lang === currentLang) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ate9-bg/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-white/70 sm:text-sm"
        >
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isCurrent = item.isCurrent ?? isLast;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {item.href && !isCurrent ? (
                    <Link
                      href={item.href}
                      className="text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-ate9-bg"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={isCurrent ? 'font-semibold text-white' : 'text-white/70'}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                  {!isLast ? <span className="text-white/40">/</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex items-center">
          <div className="flex rounded-full border border-white/20 bg-white/10 p-0.5 text-xs text-white">
            <button
              type="button"
              onClick={() => updateLang('ja')}
              aria-pressed={currentLang === 'ja'}
              className={`rounded-full px-3 py-1 transition cursor-pointer ${
                currentLang === 'ja' ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              JA
            </button>
            <button
              type="button"
              onClick={() => updateLang('en')}
              aria-pressed={currentLang === 'en'}
              className={`rounded-full px-3 py-1 transition cursor-pointer ${
                currentLang === 'en' ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
