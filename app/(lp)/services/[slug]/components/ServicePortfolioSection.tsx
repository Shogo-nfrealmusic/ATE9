import { PortfolioGrid } from '@/components/lp/portfolio/PortfolioGrid';
import type { PortfolioItemForUI } from '@/components/lp/portfolio/types';
import type { ServicePortfolioItem } from '@/services/site/service-detail';
import type { LocalizedText } from '@/types/landing';
import type { JSX } from 'react';

/**
 * ServicePortfolioSection
 * - 責務: サービスに紐づくポートフォリオ一覧をカードグリッドで表示する。
 * - props:
 *   - portfolios: サービス紐付きのポートフォリオ配列
 *   - serviceTitle: 見出し用に使用するサービス名
 */
type Lang = 'ja' | 'en';

type ServicePortfolioSectionProps = {
  portfolios: ServicePortfolioItem[];
  serviceTitle?: string;
  locale: Lang;
};

const pickLocalized = (value: LocalizedText, locale: Lang): string =>
  locale === 'en' ? value.en || value.ja : value.ja;

const worksDescriptionByLocale: Record<Lang, string> = {
  ja: 'サービスに紐づく代表的な案件をピックアップ。',
  en: 'Highlighted projects associated with each service.',
};

export function ServicePortfolioSection({
  portfolios,
  serviceTitle,
  locale,
}: ServicePortfolioSectionProps): JSX.Element {
  const worksDescription = worksDescriptionByLocale[locale];
  const items: PortfolioItemForUI[] = portfolios.map((item) => ({
    id: item.id,
    title: pickLocalized(item.title, locale),
    description: pickLocalized(item.description, locale),
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
  }));

  if (items.length === 0) {
    return (
      <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8 text-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-white/60">Works</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {serviceTitle ? `${serviceTitle} Works` : 'Selected Works'}
            </h2>
            <p className="text-base text-white/70 whitespace-pre-line">{worksDescription}</p>
          </div>
          <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-10 text-white/70">
            Coming soon. 実績を順次追加予定です。
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <PortfolioGrid
          items={items}
          heading={serviceTitle ? `${serviceTitle} Works` : 'Selected Works'}
          subtitle={worksDescription}
          eyebrowLabel="Works"
        />
      </div>
    </section>
  );
}
