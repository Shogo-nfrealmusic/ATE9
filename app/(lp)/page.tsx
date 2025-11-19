import { SectionAbout } from "@/components/lp/SectionAbout";
import { SectionBrandPhilosophy } from "@/components/lp/SectionBrandPhilosophy";
import { SectionContactForm } from "@/components/lp/SectionContactForm";
import { SectionHero } from "@/components/lp/SectionHero";
import { SectionMission } from "@/components/lp/SectionMission";
import { SectionPortfolio } from "@/components/lp/SectionPortfolio";
import { SectionServices } from "@/components/lp/SectionServices";
import { SiteFooter } from "@/components/lp/SiteFooter";
import { SiteHeader } from "@/components/lp/SiteHeader";
import { getLandingContent } from "@/services/cms/landing";

export default async function LPPage() {
  const content = await getLandingContent();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-ate9-bg text-white">
      <SiteHeader />
      <main className="flex-grow">
        <SectionHero content={content.hero} />
        <SectionAbout content={content.about} />
        <SectionBrandPhilosophy />
        <SectionMission content={content.mission} />
        <SectionServices content={content.services} />
        <SectionPortfolio content={content.portfolio} />
        <SectionContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}

