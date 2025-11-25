'use client';

import { drawLine, viewportOnce } from '@/lib/motion/variants';
import type { BrandPhilosophyContent } from '@/types/landing';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

const cardFadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const subtleFadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const closingVariantClassMap: Record<
  NonNullable<BrandPhilosophyContent['closingDescriptionParts'][number]['variant']>,
  string
> = {
  default: 'text-white/70',
  primary: 'text-white font-semibold',
  accent: 'text-ate9-red font-semibold',
};

export type SectionBrandPhilosophyProps = {
  content: BrandPhilosophyContent;
};

export function SectionBrandPhilosophy({ content }: SectionBrandPhilosophyProps): JSX.Element {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="brand-philosophy">
      <motion.div
        className="mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={cardFadeIn}
      >
        <motion.div
          className="grid grid-cols-1 items-stretch gap-12 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16 lg:py-16"
          variants={staggerContainer}
        >
          {/* 左カラム：メインテキスト */}
          <motion.div className="space-y-10 lg:space-y-12" variants={subtleFadeInUp}>
            {/* セクションタイトル */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-3xl lg:text-4xl">
                {content.heading}
              </h2>
              <motion.div className="w-16 h-0.5 bg-ate9-red" variants={drawLine} />
              <p className="text-xs text-white/60 md:text-sm">{content.subheading}</p>
            </div>

            {/* イントロコピー */}
            <div className="space-y-5">
              <p className="text-2xl font-semibold leading-relaxed tracking-[-0.02em] text-white md:text-3xl lg:text-4xl">
                {content.introHeading}
              </p>
              <div className="space-y-3 text-sm leading-relaxed text-white/70 sm:text-base">
                {content.introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* ATE 構造 */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 md:text-sm">
                {content.structureLabel}
              </h3>
              <p className="max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
                {content.structureDescription}
              </p>

              {/* A / T / E タイムライン */}
              <div className="relative pl-6 space-y-5">
                <div className="absolute left-0 top-1.5 h-full w-px bg-ate9-red/40" />

                {content.structureItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="relative"
                    variants={subtleFadeInUp}
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <div className="flex gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ate9-red" />
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-white md:text-base">
                          <span className="text-ate9-red">{item.label}</span> {item.title}
                        </p>
                        {item.subDescription && (
                          <p className="text-xs text-white/70">{item.subDescription}</p>
                        )}
                        <p className="text-sm leading-relaxed text-white/70">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 結び */}
            <div className="space-y-3 pt-4 border-t border-ate9-gray/40">
              <p className="text-base font-semibold leading-relaxed text-white sm:text-lg">
                {content.closingTitle}
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
                {content.closingDescriptionParts.map((part) => (
                  <span
                    key={part.id}
                    className={`${closingVariantClassMap[part.variant ?? 'default']} mr-1 inline-block`}
                  >
                    {part.text}
                  </span>
                ))}
              </p>
            </div>
          </motion.div>

          {/* 右カラム：哲学サマリー（テキストカラム） */}
          <motion.aside
            className="flex h-full flex-col justify-between gap-10 lg:pl-10"
            variants={subtleFadeInUp}
            transition={{ delay: 0.15 }}
          >
            <div className="space-y-4">
              {content.summaryLabel && (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {content.summaryLabel}
                </p>
              )}
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                  {content.summaryDescription}
                </p>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                  {content.summarySupportingText}
                </p>
              </div>
            </div>

            {/* A / T / E / 9 の要約 */}
            <div className="space-y-4">
              {content.summaryItemsLabel && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  {content.summaryItemsLabel}
                </p>
              )}
              <div className="space-y-3 text-xs text-white/70 sm:text-sm">
                {content.summaryItems.map((item) => (
                  <div key={item.id}>
                    <p className="text-sm font-semibold text-white">
                      <span className="text-ate9-red">{item.label}</span> {item.title}
                    </p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values をタグ風に */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                {content.coreValuesLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {content.coreValues.map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center rounded-full border border-ate9-gray/50 bg-transparent px-3 py-1 text-[11px] text-white/70 sm:text-xs"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </motion.div>
    </section>
  );
}
