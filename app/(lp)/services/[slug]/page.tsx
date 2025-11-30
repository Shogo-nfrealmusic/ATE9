import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { getPortfoliosByServiceId, getServiceDetailBySlug } from '@/services/site/service-detail';
import type { LocalizedText } from '@/types/landing';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { ServiceHero } from './components/ServiceHero';
import { ServicePortfolioSection } from './components/ServicePortfolioSection';

export const revalidate = 0;

type Lang = 'ja' | 'en';

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const pickLocalized = (value: LocalizedText, locale: 'ja' | 'en'): string =>
  locale === 'en' ? value.en || value.ja : value.ja;

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

async function loadServiceData(slug: string) {
  const service = await getServiceDetailBySlug(slug);

  if (!service) {
    return null;
  }

  const portfolios = await getPortfoliosByServiceId(service.id);

  return { service, portfolios };
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata | undefined> {
  const { slug } = await params;
  try {
    const service = await getServiceDetailBySlug(slug);

    if (!service) {
      return undefined;
    }

    const localizedTitle = pickLocalized(service.title, 'ja');
    const localizedDescription = pickLocalized(service.description, 'ja');

    return {
      title: `${localizedTitle} | ATE9`,
      description: localizedDescription,
    };
  } catch (error) {
    console.error('[ServiceDetailPage.generateMetadata] failed to load service', { slug, error });
    throw error;
  }
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: ServiceDetailPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const headersList = await headers();
  const acceptLanguageHeader = headersList.get('accept-language') ?? '';
  const locale = resolveLocale(resolvedSearchParams?.lang, acceptLanguageHeader);
  let data;
  try {
    data = await loadServiceData(slug);
  } catch (error) {
    console.error('[ServiceDetailPage] failed to load service', { slug, error });
    // fetch error の場合は空データでページをレンダリング（notFound しない）
    data = null;
  }

  if (!data) {
    notFound();
  }

  const { service, portfolios } = data;
  const serviceTitle = pickLocalized(service.title, locale);
  const serviceDescription = pickLocalized(service.description, locale);
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: serviceTitle, isCurrent: true },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-ate9-bg text-white">
      <main className="flex-1">
        <section className="border-b border-white/10 bg-transparent px-4 md:px-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb className="pt-4 pb-4 md:pt-6 md:pb-6" items={breadcrumbItems} />
          </div>
        </section>
        <ServiceHero service={service} locale={locale} />
        <ServicePortfolioSection
          portfolios={portfolios}
          serviceTitle={serviceTitle}
          locale={locale}
        />
        <section className="border-t border-white/10 bg-black/40 px-4 py-16 sm:px-6 md:py-20 lg:px-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-8 text-center shadow-[0_0_40px_rgba(242,66,109,0.1)] sm:p-12">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Contact</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {serviceTitle} について話しましょう
            </h2>
            <p className="text-base text-white/80">
              {serviceDescription ||
                'ご質問やお見積りのご相談はフォームからお気軽に。コンタクト後、チームから 24h 以内にご連絡します。'}
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-ate9-red hover:bg-ate9-red/80">
                <Link href="/#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
