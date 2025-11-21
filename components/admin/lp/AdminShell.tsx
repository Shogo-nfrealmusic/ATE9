'use client';

import { saveLandingContentAction } from '@/app/actions/landing';
import type { LandingContent } from '@/types/landing';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { SectionTabs } from './SectionTabs';
import { AboutSectionEditor } from './sections/AboutSectionEditor';
import { HeroSectionEditor } from './sections/HeroSectionEditor';
import { MissionSectionEditor } from './sections/MissionSectionEditor';
import { PortfolioSectionEditor } from './sections/PortfolioSectionEditor';
import { ServicesSectionEditor } from './sections/ServicesSectionEditor';

type AdminShellProps = {
  initialContent: LandingContent;
};

type ActiveSection = 'hero' | 'about' | 'mission' | 'services' | 'portfolio';

export function AdminShell({ initialContent }: AdminShellProps): JSX.Element {
  const [content, setContent] = useState(initialContent);
  const contentRef = useRef(content);
  const [activeSection, setActiveSection] = useState<ActiveSection>('hero');
  const [savingSection, setSavingSection] = useState<ActiveSection | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // contentが更新されたら、refも更新する
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // initialContentが変更されたときにローカルステートを更新
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = (section: ActiveSection) => {
    setSavingSection(section);
    startTransition(async () => {
      try {
        // refから最新のcontentを取得
        await saveLandingContentAction(contentRef.current);
        // サーバー側のデータを再取得して、最新の状態を反映
        router.refresh();
        toast.success('保存しました', {
          description: `${getSectionLabel(section)}の内容を保存しました`,
        });
      } catch (error) {
        toast.error('保存に失敗しました', {
          description: error instanceof Error ? error.message : '不明なエラーが発生しました',
        });
      } finally {
        setSavingSection(null);
      }
    });
  };

  const getSectionLabel = (section: ActiveSection): string => {
    const labels: Record<ActiveSection, string> = {
      hero: 'Hero',
      about: 'About',
      mission: 'Mission',
      services: 'Services',
      portfolio: 'Portfolio',
    };
    return labels[section];
  };

  const isSaving = (section: ActiveSection) =>
    savingSection === section || (section !== null && isPending);

  return (
    <div className="flex h-screen overflow-hidden bg-ate9-bg text-white">
      {/* 左サイドバー */}
      <div className="w-64 border-r border-ate9-gray/60 bg-ate9-bg">
        <div className="p-6 border-b border-ate9-gray/60">
          <h1 className="text-xl font-semibold tracking-tight">LP Admin</h1>
          <p className="text-sm text-white/60 mt-1">Landing Page 編集</p>
        </div>
        <SectionTabs activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* 右コンテンツエリア */}
      <div className="flex-1 overflow-y-auto bg-ate9-bg">
        <div className="p-8 space-y-8">
          {activeSection === 'hero' && (
            <HeroSectionEditor
              hero={content.hero}
              onChange={(hero) => setContent((prev) => ({ ...prev, hero }))}
              onSave={() => handleSave('hero')}
              isSaving={isSaving('hero')}
            />
          )}
          {activeSection === 'about' && (
            <AboutSectionEditor
              about={content.about}
              onChange={(about) => setContent((prev) => ({ ...prev, about }))}
              onSave={() => handleSave('about')}
              isSaving={isSaving('about')}
            />
          )}
          {activeSection === 'mission' && (
            <MissionSectionEditor
              mission={content.mission}
              onChange={(mission) => setContent((prev) => ({ ...prev, mission }))}
              onSave={() => handleSave('mission')}
              isSaving={isSaving('mission')}
            />
          )}
          {activeSection === 'services' && (
            <ServicesSectionEditor
              services={content.services}
              onChange={(services) => setContent((prev) => ({ ...prev, services }))}
              onSave={() => handleSave('services')}
              isSaving={isSaving('services')}
            />
          )}
          {activeSection === 'portfolio' && (
            <PortfolioSectionEditor
              portfolio={content.portfolio}
              onChange={(portfolio) => setContent((prev) => ({ ...prev, portfolio }))}
              onSave={() => handleSave('portfolio')}
              isSaving={isSaving('portfolio')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
