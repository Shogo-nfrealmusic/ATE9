import { SectionAbout } from '@/components/lp/SectionAbout';
import { SectionBrandPhilosophy } from '@/components/lp/SectionBrandPhilosophy';
import { SectionContactForm } from '@/components/lp/SectionContactForm';
import { SectionHero } from '@/components/lp/SectionHero';
import { SectionServices } from '@/components/lp/SectionServices';
import { SiteFooter } from '@/components/lp/SiteFooter';
import { SiteHeader } from '@/components/lp/SiteHeader';
import { getLandingContent } from '@/services/cms/landing';
import { headers } from 'next/headers';
import type { JSX } from 'react';

export const revalidate = 0;

type Lang = 'ja' | 'en';

type LPPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const resolveLocale = (langParam: string | undefined, acceptLanguageHeader: string): Lang => {
  if (langParam === 'ja' || langParam === 'en') {
    return langParam;
  }

  const normalized = acceptLanguageHeader.toLowerCase();
  if (normalized.startsWith('en')) {
    return 'en';
  }

  return 'ja';
};

export default async function LPPage({ searchParams }: LPPageProps): Promise<JSX.Element> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const headersList = await headers();
  const acceptLanguageHeader = headersList.get('accept-language') ?? '';
  const locale = resolveLocale(resolvedSearchParams?.lang, acceptLanguageHeader);
  const content = await getLandingContent();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-ate9-bg text-white">
      <SiteHeader locale={locale} />
      <main className="grow">
        <SectionHero content={content.hero} locale={locale} />
        <SectionAbout content={content.about} locale={locale} />
        <SectionBrandPhilosophy content={content.brandPhilosophy} locale={locale} />
        <SectionServices content={content.services} locale={locale} />
        <SectionContactForm locale={locale} />
      </main>
      <SiteFooter />
    </div>
  );
}
