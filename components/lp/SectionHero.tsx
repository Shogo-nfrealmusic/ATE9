"use client";

import { fadeInUp, motionTransition, staggerContainerFast } from "@/lib/motion/variants";
import type { HeroContent } from "@/types/landing";
import { motion } from "framer-motion";

type SectionHeroProps = {
  content: HeroContent;
};

export function SectionHero({ content }: SectionHeroProps) {
  // テキストを行ごとに分割（改行で区切る、改行がない場合はそのまま）
  const headingLines = content.heading.includes("\n")
    ? content.heading.split("\n")
    : [content.heading];
  const subheadingLines = content.subheading.includes("\n")
    ? content.subheading.split("\n")
    : [content.subheading];

  const handleCtaClick = () => {
    const link = content.ctaLink?.trim();
    if (!link) return;

    // 同一ページ内のアンカー（例: #contact）の場合はスムーススクロール
    if (link.startsWith("#")) {
      if (typeof document !== "undefined") {
        const target = document.querySelector(link);
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
      return;
    }

    // 外部 URL or パスの場合はそのまま遷移
    if (typeof window !== "undefined") {
      if (link.startsWith("http://") || link.startsWith("https://")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = link;
      }
    }
  };

  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center text-center p-8 relative overflow-hidden"
      id="hero"
    >
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0"></div>
      
      {/* Spotlight風の背景エフェクト */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
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
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* 下部の赤いライン */}
      <motion.div
        className="absolute bottom-10 h-0.5 w-1/4 bg-gradient-to-r from-transparent via-ate9-red-dark to-transparent z-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, ...motionTransition.default }}
      />

      {/* メインコンテンツ */}
      <motion.div
        className="relative z-10 flex flex-col gap-8"
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
      >
        {/* 見出し（行ごとにstagger） */}
        <motion.h1
          className="text-white text-5xl font-bold leading-tight tracking-tighter md:text-7xl"
          variants={fadeInUp}
        >
          {headingLines.map((line, index) => (
            <motion.span
              key={index}
              className="block"
              variants={fadeInUp}
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        {/* サブコピー */}
        <motion.h2
          className="text-white/80 text-base font-normal leading-normal max-w-2xl mx-auto md:text-lg"
          variants={fadeInUp}
        >
          {subheadingLines.map((line, index) => (
            <motion.span
              key={index}
              className="block"
              variants={fadeInUp}
            >
              {line}
            </motion.span>
          ))}
        </motion.h2>

        {/* CTA ボタン */}
        {content.ctaLabel && (
          <motion.div
            variants={fadeInUp}
            className="mt-2 flex justify-center"
          >
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center rounded-full bg-ate9-red px-8 py-3 text-sm font-bold tracking-[0.08em] uppercase text-white shadow-lg shadow-ate9-red/30 transition-transform transition-colors hover:bg-ate9-red-dark hover:shadow-ate9-red/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {content.ctaLabel}
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
