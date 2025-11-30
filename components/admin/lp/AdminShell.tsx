'use client';

import {
  saveAboutSectionAction,
  saveBrandPhilosophySectionAction,
  saveHeroSectionAction,
  savePortfolioMetadataAction,
  saveServicesSectionAction,
} from '@/app/actions/landing';
import { AdminLogoutButton } from '@/components/admin/lp/AdminLogoutButton';
import { ToasterClient } from '@/components/ui/ToasterClient';
import type { LandingContent, PortfolioItem } from '@/types/landing';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { SectionTabs, type ActiveSection } from './SectionTabs';
import { AboutSectionEditor } from './sections/AboutSectionEditor';
import { BrandPhilosophySectionEditor } from './sections/BrandPhilosophySectionEditor';
import { HeroSectionEditor } from './sections/HeroSectionEditor';
import { PortfolioSectionEditor } from './sections/PortfolioSectionEditor';
import { ServiceWorksDialog } from './sections/ServiceWorksDialog';
import { ServicesSectionEditor } from './sections/ServicesSectionEditor';
import type { ManageWorksTarget } from './types';

type AdminShellProps = {
  initialContent: LandingContent;
};

const normalizeServiceKey = (value: string | null | undefined) => value ?? null;

const replaceItemsForService = (
  items: PortfolioItem[],
  serviceId: string | null,
  nextItems: PortfolioItem[],
): PortfolioItem[] => {
  const target = normalizeServiceKey(serviceId);
  const normalizedNext = nextItems.map((item) => ({
    ...item,
    serviceId: target,
  }));

  const result: PortfolioItem[] = [];
  let inserted = false;

  for (const item of items) {
    if (normalizeServiceKey(item.serviceId) === target) {
      if (!inserted) {
        result.push(...normalizedNext);
        inserted = true;
      }
      continue;
    }
    result.push(item);
  }

  if (!inserted && normalizedNext.length > 0) {
    result.push(...normalizedNext);
  }

  return result;
};

export function AdminShell({ initialContent }: AdminShellProps): JSX.Element {
  const [content, setContent] = useState(initialContent);
  const contentRef = useRef(initialContent);
  const [activeSection, setActiveSection] = useState<ActiveSection>('hero');
  const [savingSection, setSavingSection] = useState<ActiveSection | null>(null);
  const [isPending, startTransition] = useTransition();
  const [worksDialogTarget, setWorksDialogTarget] = useState<ManageWorksTarget | null>(null);
  const router = useRouter();

  // initialContentが変更されたときにローカルステートを更新
  useEffect(() => {
    setContent(initialContent);
    contentRef.current = initialContent;
  }, [initialContent]);

  const updateContent = (updater: LandingContent | ((prev: LandingContent) => LandingContent)) => {
    setContent((prev) => {
      const next =
        typeof updater === 'function'
          ? (updater as (value: LandingContent) => LandingContent)(prev)
          : updater;
      contentRef.current = next;
      return next;
    });
  };

  const openWorksDialogForService = (target: ManageWorksTarget) => {
    setWorksDialogTarget(target);
  };

  const closeWorksDialog = () => setWorksDialogTarget(null);

  const worksDialogItems = useMemo(() => {
    if (!worksDialogTarget) {
      return [];
    }
    const targetKey = normalizeServiceKey(worksDialogTarget.serviceId);
    return content.portfolio.items.filter(
      (item) => normalizeServiceKey(item.serviceId) === targetKey,
    );
  }, [content.portfolio.items, worksDialogTarget]);

  const handleWorksSaved = (params: { serviceId: string | null; items: PortfolioItem[] }) => {
    updateContent((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        items: replaceItemsForService(prev.portfolio.items, params.serviceId, params.items),
      },
    }));
  };

  const handlePortfolioRelinked = ({
    itemId,
    targetServiceId,
  }: {
    itemId: string;
    targetServiceId: string;
  }) => {
    updateContent((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        items: prev.portfolio.items.map((item) =>
          item.id === itemId ? { ...item, serviceId: targetServiceId } : item,
        ),
      },
    }));
  };

  const handleSave = (section: ActiveSection) => {
    setSavingSection(section);
    startTransition(async () => {
      try {
        const saveHandlers: Record<ActiveSection, () => Promise<void>> = {
          hero: () => saveHeroSectionAction(contentRef.current.hero),
          about: () => saveAboutSectionAction(contentRef.current.about),
          services: () => saveServicesSectionAction(contentRef.current.services),
          portfolio: () =>
            savePortfolioMetadataAction({
              heading: contentRef.current.portfolio.heading,
              subheading: contentRef.current.portfolio.subheading,
            }),
          brandPhilosophy: () =>
            saveBrandPhilosophySectionAction(contentRef.current.brandPhilosophy),
        };

        await saveHandlers[section]();
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
      services: 'Services',
      portfolio: 'Portfolio',
      brandPhilosophy: 'Brand Philosophy',
    };
    return labels[section];
  };

  const isSaving = (section: ActiveSection) =>
    savingSection === section || (section !== null && isPending);

  return (
    <div className="flex h-screen overflow-hidden bg-ate9-bg text-text-body">
      {/* 左サイドバー */}
      <div className="w-64 border-r border-ate9-gray/60 bg-ate9-bg text-white flex flex-col">
        <div className="p-6 border-b border-ate9-gray/60">
          <h1 className="text-xl font-semibold tracking-tight">LP Admin</h1>
          <p className="text-sm text-white/60 mt-1">Landing Page 編集</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SectionTabs activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>
        <div className="p-4 border-t border-ate9-gray/60">
          <AdminLogoutButton />
        </div>
      </div>

      {/* 右コンテンツエリア */}
      <div className="flex-1 overflow-y-auto bg-ate9-bg">
        <div className="p-8 space-y-8">
          {activeSection === 'hero' && (
            <HeroSectionEditor
              hero={content.hero}
              onChange={(hero) => updateContent((prev) => ({ ...prev, hero }))}
              onSave={() => handleSave('hero')}
              isSaving={isSaving('hero')}
            />
          )}
          {activeSection === 'about' && (
            <AboutSectionEditor
              about={content.about}
              onChange={(about) => updateContent((prev) => ({ ...prev, about }))}
              onSave={() => handleSave('about')}
              isSaving={isSaving('about')}
            />
          )}
          {activeSection === 'services' && (
            <ServicesSectionEditor
              services={content.services}
              portfolioItems={content.portfolio.items}
              onChange={(services) => updateContent((prev) => ({ ...prev, services }))}
              onSave={() => handleSave('services')}
              isSaving={isSaving('services')}
              onManageWorks={openWorksDialogForService}
            />
          )}
          {activeSection === 'portfolio' && (
            <PortfolioSectionEditor
              portfolio={content.portfolio}
              services={content.services.items}
              onChange={(portfolio) => updateContent((prev) => ({ ...prev, portfolio }))}
              onSave={() => handleSave('portfolio')}
              isSaving={isSaving('portfolio')}
              onManageWorks={openWorksDialogForService}
            />
          )}
          {activeSection === 'brandPhilosophy' && (
            <BrandPhilosophySectionEditor
              brandPhilosophy={content.brandPhilosophy}
              onChange={(brandPhilosophy) =>
                updateContent((prev) => ({ ...prev, brandPhilosophy }))
              }
              onSave={() => handleSave('brandPhilosophy')}
              isSaving={isSaving('brandPhilosophy')}
            />
          )}
        </div>
      </div>
      {worksDialogTarget && (
        <ServiceWorksDialog
          open={Boolean(worksDialogTarget)}
          serviceId={worksDialogTarget.serviceId}
          serviceTitle={worksDialogTarget.serviceTitle}
          serviceSlug={worksDialogTarget.serviceSlug}
          items={worksDialogItems}
          services={content.services.items}
          onItemsSaved={handleWorksSaved}
          onPortfolioRelinked={handlePortfolioRelinked}
          onClose={closeWorksDialog}
        />
      )}
      <ToasterClient />
    </div>
  );
}
