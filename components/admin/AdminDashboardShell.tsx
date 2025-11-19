"use client";

import { Button } from "@/components/ui/button";
import { saveLandingContent } from "@/services/cms/landing";
import type { LandingContent } from "@/types/landing";
import { useState, useTransition } from "react";
import { AboutEditor } from "./AboutEditor";
import { HeroEditor } from "./HeroEditor";
import { MissionEditor } from "./MissionEditor";
import { PortfolioEditor } from "./PortfolioEditor";
import { ServicesEditor } from "./ServicesEditor";

type AdminDashboardShellProps = {
  initialContent: LandingContent;
};

type SavingSection = "hero" | "about" | "mission" | "services" | "portfolio" | null;
type ActiveSection = Exclude<SavingSection, null>;

export function AdminDashboardShell({
  initialContent,
}: AdminDashboardShellProps) {
  const [content, setContent] = useState(initialContent);
  const [savingSection, setSavingSection] = useState<SavingSection>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const persist = (section: Exclude<SavingSection, null>) => {
    setSavingSection(section);
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const saved = await saveLandingContent(content);
        setContent(saved);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to save content"
        );
      } finally {
        setSavingSection(null);
      }
    });
  };

  const isSaving = (section: SavingSection) =>
    savingSection === section || (section !== null && isPending);

  const sections: { id: ActiveSection; label: string; description: string }[] =
    [
      {
        id: "hero",
        label: "Hero",
        description: "メインのキャッチコピーとキービジュアルを編集します。",
      },
      {
        id: "about",
        label: "About",
        description: "Aboutセクションの見出しと説明文を編集します。",
      },
      {
        id: "mission",
        label: "Mission",
        description: "Missionセクションの見出しと説明文を編集します。",
      },
      {
        id: "services",
        label: "Services",
        description: "サービス紹介のテキストとカード一覧を編集します。",
      },
      {
        id: "portfolio",
        label: "Portfolio",
        description: "実績セクションの案件一覧を編集します。",
      },
    ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-headings dark:text-white">
            Landing Page Admin
          </h1>
          <p className="text-sm text-text-body dark:text-gray-400">
            編集したいセクションを選んで、コンテンツを更新してください。
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
          <div className="inline-flex rounded-lg border border-gray-200 bg-background-light/80 p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
            {sections.map((section) => (
              <Button
                key={section.id}
                type="button"
                size="sm"
                variant={activeSection === section.id ? "default" : "ghost"}
                className={
                  activeSection === section.id
                    ? "shadow-sm"
                    : "text-text-body dark:text-gray-300"
                }
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-text-body dark:text-gray-400">
          {
            sections.find((section) => section.id === activeSection)
              ?.description
          }
        </p>

        {activeSection === "hero" && (
          <HeroEditor
            hero={content.hero}
            onChange={(hero) => setContent((prev) => ({ ...prev, hero }))}
            onSave={() => persist("hero")}
            isSaving={isSaving("hero")}
          />
        )}

        {activeSection === "about" && (
          <AboutEditor
            about={content.about}
            onChange={(about) => setContent((prev) => ({ ...prev, about }))}
            onSave={() => persist("about")}
            isSaving={isSaving("about")}
          />
        )}

        {activeSection === "mission" && (
          <MissionEditor
            mission={content.mission}
            onChange={(mission) => setContent((prev) => ({ ...prev, mission }))}
            onSave={() => persist("mission")}
            isSaving={isSaving("mission")}
          />
        )}

        {activeSection === "services" && (
          <ServicesEditor
            services={content.services}
            onChange={(services) =>
              setContent((prev) => ({ ...prev, services }))
            }
            onSave={() => persist("services")}
            isSaving={isSaving("services")}
          />
        )}

        {activeSection === "portfolio" && (
          <PortfolioEditor
            portfolio={content.portfolio}
            onChange={(portfolio) =>
              setContent((prev) => ({ ...prev, portfolio }))
            }
            onSave={() => persist("portfolio")}
            isSaving={isSaving("portfolio")}
          />
        )}
      </div>
    </div>
  );
}

