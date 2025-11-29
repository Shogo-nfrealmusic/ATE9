import { SectionAbout } from '@/components/lp/SectionAbout';
import { SectionBrandPhilosophy } from '@/components/lp/SectionBrandPhilosophy';
import { SectionContactForm } from '@/components/lp/SectionContactForm';
import { SectionHero } from '@/components/lp/SectionHero';
import { SectionServices } from '@/components/lp/SectionServices';
import { SiteFooter } from '@/components/lp/SiteFooter';
import { SiteHeader } from '@/components/lp/SiteHeader';
import { getLandingContent } from '@/services/cms/landing';
import type { JSX } from 'react';

export const revalidate = 0;

export default async function LPPage(): Promise<JSX.Element> {
  const content = await getLandingContent();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-ate9-bg text-white">
      <SiteHeader />
      <main className="grow">
        <SectionHero content={content.hero} />
        <SectionAbout content={content.about} />
        <SectionBrandPhilosophy content={content.brandPhilosophy} />
        <SectionServices content={content.services} />
        <SectionContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
