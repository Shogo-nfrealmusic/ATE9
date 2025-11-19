"use client";

import { saveLandingContent } from "@/services/cms/landing";
import type { LandingContent } from "@/types/landing";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { SectionTabs } from "./SectionTabs";
import { AboutSectionEditor } from "./sections/AboutSectionEditor";
import { HeroSectionEditor } from "./sections/HeroSectionEditor";
import { MissionSectionEditor } from "./sections/MissionSectionEditor";
import { PortfolioSectionEditor } from "./sections/PortfolioSectionEditor";
import { ServicesSectionEditor } from "./sections/ServicesSectionEditor";

type AdminShellProps = {
  initialContent: LandingContent;
};

type ActiveSection = "hero" | "about" | "mission" | "services" | "portfolio";

export function AdminShell({ initialContent }: AdminShellProps) {
  const [content, setContent] = useState(initialContent);
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [savingSection, setSavingSection] = useState<ActiveSection | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = (section: ActiveSection) => {
    setSavingSection(section);
    startTransition(async () => {
      try {
        const saved = await saveLandingContent(content);
        setContent(saved);
        toast.success("保存しました", {
          description: `${getSectionLabel(section)}の内容を保存しました`,
        });
      } catch (error) {
        toast.error("保存に失敗しました", {
          description:
            error instanceof Error ? error.message : "不明なエラーが発生しました",
        });
      } finally {
        setSavingSection(null);
      }
    });
  };

  const getSectionLabel = (section: ActiveSection): string => {
    const labels: Record<ActiveSection, string> = {
      hero: "Hero",
      about: "About",
      mission: "Mission",
      services: "Services",
      portfolio: "Portfolio",
    };
    return labels[section];
  };

  const isSaving = (section: ActiveSection) =>
    savingSection === section || (section !== null && isPending);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左サイドバー */}
      <div className="w-64 border-r bg-white dark:bg-gray-900">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold">LP Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Landing Page 編集
          </p>
        </div>
        <SectionTabs
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* 右コンテンツエリア */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        <div className="p-8">
          {activeSection === "hero" && (
            <HeroSectionEditor
              hero={content.hero}
              onChange={(hero) => setContent((prev) => ({ ...prev, hero }))}
              onSave={() => handleSave("hero")}
              isSaving={isSaving("hero")}
            />
          )}
          {activeSection === "about" && (
            <AboutSectionEditor
              about={content.about}
              onChange={(about) => setContent((prev) => ({ ...prev, about }))}
              onSave={() => handleSave("about")}
              isSaving={isSaving("about")}
            />
          )}
          {activeSection === "mission" && (
            <MissionSectionEditor
              mission={content.mission}
              onChange={(mission) => setContent((prev) => ({ ...prev, mission }))}
              onSave={() => handleSave("mission")}
              isSaving={isSaving("mission")}
            />
          )}
          {activeSection === "services" && (
            <ServicesSectionEditor
              services={content.services}
              onChange={(services) =>
                setContent((prev) => ({ ...prev, services }))
              }
              onSave={() => handleSave("services")}
              isSaving={isSaving("services")}
            />
          )}
          {activeSection === "portfolio" && (
            <PortfolioSectionEditor
              portfolio={content.portfolio}
              onChange={(portfolio) =>
                setContent((prev) => ({ ...prev, portfolio }))
              }
              onSave={() => handleSave("portfolio")}
              isSaving={isSaving("portfolio")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

