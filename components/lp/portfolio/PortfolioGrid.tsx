import type { JSX } from 'react';
import { PortfolioCard } from './PortfolioCard';
import type { PortfolioItemForUI } from './types';

type PortfolioGridProps = {
  items: PortfolioItemForUI[];
  heading?: string;
  subtitle?: string;
  eyebrowLabel?: string;
};

/**
 * PortfolioGrid
 * - 責務: 見出し・サブコピーとともにポートフォリオカードのグリッドを描画。
 * - props: 表示する項目一覧とヘッダーテキスト。
 */
export function PortfolioGrid({
  items,
  heading,
  subtitle,
  eyebrowLabel,
}: PortfolioGridProps): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {(heading || subtitle) && (
        <div className="text-center">
          {eyebrowLabel && (
            <p className="text-xs uppercase tracking-[0.45em] text-white/60">{eyebrowLabel}</p>
          )}
          {heading && (
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white sm:text-4xl">
              {heading}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base whitespace-pre-line">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
        {items.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
