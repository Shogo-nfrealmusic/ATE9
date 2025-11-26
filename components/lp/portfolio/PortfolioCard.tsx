'use client';

import { fadeInUp, hoverScale, motionTransition, viewportOnce } from '@/lib/motion/variants';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { JSX } from 'react';
import type { PortfolioItemForUI } from './types';

type PortfolioCardProps = {
  item: PortfolioItemForUI;
};

/**
 * PortfolioCard
 * - 責務: 単一のポートフォリオカードを描画し、ホバー演出やリンク遷移を提供する。
 * - props: PortfolioItemForUI で受け取った案件情報。
 */
export function PortfolioCard({ item }: PortfolioCardProps): JSX.Element {
  const card = (
    <motion.div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-ate9-gray"
      variants={fadeInUp}
      whileHover={hoverScale}
    >
      <motion.div
        className="relative flex h-full flex-col"
        transition={motionTransition.fast}
        whileHover={{ y: -4 }}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            alt={item.title}
            className="rounded-t-xl object-cover"
            src={item.imageUrl}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 opacity-0 bg-linear-to-t from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <motion.div
          className="flex flex-1 flex-col gap-2 p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={motionTransition.fast}
        >
          <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-ate9-red-light sm:text-2xl">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-white/80 sm:text-base">{item.description}</p>
          )}
          {item.linkUrl && (
            <span className="mt-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
              <span className="relative inline-block">
                <span className="relative z-10">View Project</span>
                <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-50 bg-white/30 transition-transform duration-300 group-hover:scale-x-100 group-hover:bg-ate9-red" />
              </span>
            </span>
          )}
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent"
          whileHover={{ borderColor: 'rgb(242, 66, 109)' }}
          transition={motionTransition.fast}
        />
      </motion.div>
    </motion.div>
  );

  if (!item.linkUrl) {
    return <div className="h-full">{card}</div>;
  }

  const isExternal = /^https?:\/\//.test(item.linkUrl);

  return (
    <a
      href={item.linkUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {card}
    </a>
  );
}
