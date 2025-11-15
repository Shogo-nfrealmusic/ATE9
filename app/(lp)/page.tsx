import { SectionContactForm } from "@/components/lp/SectionContactForm";
import { SectionHero } from "@/components/lp/SectionHero";
import { SectionMission } from "@/components/lp/SectionMission";
import { SectionPortfolio } from "@/components/lp/SectionPortfolio";
import { SectionServices } from "@/components/lp/SectionServices";
import { SiteFooter } from "@/components/lp/SiteFooter";
import { SiteHeader } from "@/components/lp/SiteHeader";

export default function LPPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <SectionHero />
        <SectionMission />
        <SectionServices />
        <SectionPortfolio />
        <SectionContactForm />
      </main>
      <SiteFooter />
    </>
  );
}

