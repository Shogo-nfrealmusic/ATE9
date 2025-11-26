'use client';

import { motionTransition, staggerContainer, viewportOnce } from '@/lib/motion/variants';
import { motion } from 'framer-motion';
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
            <motion.p
              className="text-xs uppercase tracking-[0.45em] text-white/60"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={motionTransition.fast}
            >
              {eyebrowLabel}
            </motion.p>
          )}
          {heading && (
            <motion.h2
              className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={motionTransition.default}
            >
              {heading}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="mx-auto mt-4 max-w-2xl text-sm text-white/70 sm:text-base"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={motionTransition.default}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {items.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
