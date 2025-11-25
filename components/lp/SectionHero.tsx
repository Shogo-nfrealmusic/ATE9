'use client';

import { fadeInUp, motionTransition, staggerContainerFast } from '@/lib/motion/variants';
import type { HeroContent } from '@/types/landing';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

type SectionHeroProps = {
  content: HeroContent;
};

export function SectionHero({ content }: SectionHeroProps): JSX.Element {
  // テキストを行ごとに分割（改行で区切る、改行がない場合はそのまま）
  const headingLines = content.heading.includes('\n')
    ? content.heading.split('\n')
    : [content.heading];
  const subheadingLines = content.subheading.includes('\n')
    ? content.subheading.split('\n')
    : [content.subheading];

  const handleCtaClick = () => {
    const link = content.ctaLink?.trim();
    if (!link) return;

    // 同一ページ内のアンカー（例: #contact）の場合はスムーススクロール
    if (link.startsWith('#')) {
      if (typeof document !== 'undefined') {
        const target = document.querySelector(link);
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // 外部 URL or パスの場合はそのまま遷移
    if (typeof window !== 'undefined') {
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = link;
      }
    }
  };

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-10"
      id="hero"
    >
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-0" />

      {/* Spotlight風の背景エフェクト */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ate9-red-dark/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* 下部の赤いライン */}
      <motion.div
        className="absolute bottom-10 z-0 h-0.5 w-1/3 bg-linear-to-r from-transparent via-ate9-red-dark to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, ...motionTransition.default }}
      />

      {/* メインコンテンツ */}
      <motion.div
        className="relative z-10 flex flex-col gap-6 sm:gap-8"
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
      >
        {/* 見出し（行ごとにstagger） */}
        <motion.h1
          className="text-4xl font-bold leading-tight tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl"
          variants={fadeInUp}
        >
          {headingLines.map((line, index) => (
            <motion.span key={index} className="block" variants={fadeInUp}>
              {line}
            </motion.span>
          ))}
        </motion.h1>

        {/* サブコピー */}
        <motion.h2
          className="mx-auto max-w-3xl text-sm font-normal leading-relaxed text-white/80 sm:text-base md:text-lg"
          variants={fadeInUp}
        >
          {subheadingLines.map((line, index) => (
            <motion.span key={index} className="block" variants={fadeInUp}>
              {line}
            </motion.span>
          ))}
        </motion.h2>

        {/* CTA ボタン */}
        {content.ctaLabel && (
          <motion.div variants={fadeInUp} className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-ate9-red px-8 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-ate9-red/30 transition hover:bg-ate9-red-dark hover:shadow-ate9-red/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:min-w-[160px] sm:w-auto"
            >
              {content.ctaLabel}
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
