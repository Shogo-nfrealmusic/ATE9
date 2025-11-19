/**
 * ATE9 LP 共通アニメーションバリアント
 * 
 * Framer Motion の variants と transition を統一管理
 * 黒×赤ミニマルデザインに調和する控えめで存在感のあるアニメーション
 */

import type { Variants } from "framer-motion";

/**
 * 共通の transition 設定
 */
export const motionTransition = {
  default: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] as const, // easeOut
  },
  fast: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
  slow: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
} as const;

/**
 * フェードイン + 上方向スライド
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransition.default,
  },
};

/**
 * フェードインのみ
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: motionTransition.default,
  },
};

/**
 * スケールイン
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: motionTransition.default,
  },
};

/**
 * 左から右へ描かれるアニメーション（下線など）
 */
export const drawLine: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      ...motionTransition.fast,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

/**
 * コンテナ用：子要素を順番に表示（staggerChildren）
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * コンテナ用：子要素を順番に表示（より速い間隔）
 */
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/**
 * ホバー時のスケールアップ（控えめ）
 */
export const hoverScale = {
  scale: 1.03,
  transition: motionTransition.fast,
};

/**
 * ホバー時のスケールアップ（より控えめ）
 */
export const hoverScaleSubtle = {
  scale: 1.02,
  transition: motionTransition.fast,
};

/**
 * スクロール連動用の viewport 設定
 */
export const viewportOnce = {
  once: true,
  margin: "-100px",
} as const;

export const viewportOnceTight = {
  once: true,
  margin: "-50px",
} as const;

/**
 * prefers-reduced-motion を考慮した transition
 * ユーザーがアニメーションを減らす設定にしている場合は即座に完了
 */
export const getReducedMotionTransition = (transition: typeof motionTransition.default) => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { duration: 0 };
  }
  return transition;
};

