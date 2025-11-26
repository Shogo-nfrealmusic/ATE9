import { Button } from '@/components/ui/button';
import { getPortfoliosByServiceId, getServiceDetailBySlug } from '@/services/site/service-detail';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { ServiceHero } from './components/ServiceHero';
import { ServicePortfolioSection } from './components/ServicePortfolioSection';

export const dynamic = 'force-dynamic';

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
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
  const service = await getServiceDetailBySlug(slug);

  if (!service) {
    return undefined;
  }

  return {
    title: `${service.title} | ATE9`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const data = await loadServiceData(slug);

  if (!data) {
    notFound();
  }

  const { service, portfolios } = data;

  return (
    <div className="flex min-h-screen flex-col bg-ate9-bg text-white">
      <main className="flex-1">
        <ServiceHero service={service} />
        <ServicePortfolioSection portfolios={portfolios} serviceTitle={service.title} />
        <section className="border-t border-white/10 bg-black/40 px-4 py-16 sm:px-6 md:py-20 lg:px-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-8 text-center shadow-[0_0_40px_rgba(242,66,109,0.1)] sm:p-12">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Contact</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {service.title} について話しましょう
            </h2>
            <p className="text-base text-white/80">
              ご質問やお見積りのご相談はフォームからお気軽に。コンタクト後、チームから 24h
              以内にご連絡します。
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
