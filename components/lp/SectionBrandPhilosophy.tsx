"use client";

import { drawLine, viewportOnce } from "@/lib/motion/variants";
import { motion } from "framer-motion";

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

const coreValues = [
  "揺るがない意思と、自分の足で立ち続ける覚悟",
  "攻めの姿勢と、言葉より先に動く圧倒的行動力",
  "平凡や「当たり前」への反逆と再定義",
  "仲間とともに限界を超えていく熱量と連帯",
  "結果に責任を持つ、実力主義のスタンス",
];

export function SectionBrandPhilosophy() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-10" id="brand-philosophy">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={cardFadeIn}
      >
        <motion.div
          className="grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-stretch py-12 sm:py-14 lg:py-16"
          variants={staggerContainer}
        >
          {/* 左カラム：メインテキスト */}
          <motion.div className="space-y-10 lg:space-y-12" variants={subtleFadeInUp}>
            {/* セクションタイトル */}
            <div className="space-y-3">
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em]">
                Brand Philosophy
              </h2>
              <motion.div
                className="w-16 h-0.5 bg-ate9-red"
                variants={drawLine}
              />
              <p className="text-xs md:text-sm text-white/60">私たちは何者か</p>
            </div>

            {/* イントロコピー */}
            <div className="space-y-5">
              <p className="text-white text-3xl lg:text-4xl font-semibold leading-relaxed tracking-[-0.02em]">
                「夢なんて願わない。俺たちは、喰らって叶える。」
              </p>
              <div className="space-y-3 max-w-3xl text-sm md:text-base text-white/70 leading-relaxed">
                <p>
                  ATE9は、チャンスを待つブランドではない。
                  <br />
                  夢を食らい、限界を超え、世界を変える。
                </p>
                <p>
                  理想は願うものではなく、自らの手で飲み込み、現実にするものだ。
                </p>
              </div>
            </div>

            {/* ATE 構造 */}
            <div className="space-y-6">
              <h3 className="text-xs md:text-sm text-white/60 font-semibold tracking-[0.18em] uppercase">
                Structure
              </h3>
              <p className="max-w-3xl text-sm md:text-base text-white/70 leading-relaxed">
                ATE = 腐った常識を打ち破り、世界を貪欲に変えていくための「始まりのコード」。
              </p>

              {/* A / T / E タイムライン */}
              <div className="relative pl-6 space-y-5">
                <div className="absolute left-0 top-1.5 h-full w-px bg-ate9-red/40" />

                {/* A */}
                <motion.div
                  className="relative"
                  variants={subtleFadeInUp}
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ate9-red" />
                    <div className="space-y-1.5">
                      <p className="text-sm md:text-base text-white font-semibold">
                        <span className="text-ate9-red">A</span> = Ace（始まり）
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        最初に動く者。誰よりも早く挑戦し、道を切り拓くリーダー。
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* T */}
                <motion.div
                  className="relative"
                  variants={subtleFadeInUp}
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ate9-red" />
                    <div className="space-y-1.5">
                      <p className="text-sm md:text-base text-white font-semibold">
                        <span className="text-ate9-red">T</span> = Top（頂点）
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        中途半端では終わらない。どんな障壁も越え、「極み」へと突き進む者。
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* E */}
                <motion.div
                  className="relative"
                  variants={subtleFadeInUp}
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ate9-red" />
                    <div className="space-y-1.5">
                      <p className="text-sm md:text-base text-white font-semibold">
                        <span className="text-ate9-red">E</span> = Evolve / Elevate / Empower
                      </p>
                      <p className="text-xs text-white/70">
                        （進化・高める・力を与える）
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        成功で終わらず、常に進化を求め、仲間とともに高まり合い、世界に影響を与えていく。
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 結び */}
            <div className="space-y-3 pt-4 border-t border-ate9-gray/40">
              <p className="text-sm md:text-base text-white font-semibold leading-relaxed">
                ATE9 = Ate Nine = 「限界（9）を食らった存在」。
              </p>
              <p className="max-w-3xl text-sm md:text-base text-white/70 leading-relaxed">
                <strong className="text-white">8（＝無限の仲間たち）</strong> ×{" "}
                <strong className="text-ate9-red">9（＝常識や限界）</strong> を超えていく。
                俺たちは、常識を打ち破る。時代を動かす。未来を創る。
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
              <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                Philosophy Summary
              </p>
              <div className="space-y-2">
                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                  シンボルの「<span className="text-ate9-red font-bold">9</span>」は、常識を超える視点。
                </p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  宇宙的でポジティブな反逆。世界の枠組みそのものに挑む意思を表す。
                </p>
              </div>
            </div>

            {/* A / T / E / 9 の要約 */}
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                A / T / E / 9
              </p>
              <div className="space-y-3 text-xs md:text-sm text-white/70">
                <div>
                  <p className="text-sm text-white font-semibold">
                    <span className="text-ate9-red">A</span> = Ace（始まり）
                  </p>
                  <p>最初に動く者。誰よりも早く挑戦し、道を切り拓くリーダー。</p>
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">
                    <span className="text-ate9-red">T</span> = Top（頂点）
                  </p>
                  <p>中途半端では終わらない。どんな障壁も越え、「極み」へと突き進む者。</p>
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">
                    <span className="text-ate9-red">E</span> = Evolve / Elevate / Empower
                  </p>
                  <p>成功で終わらず、常に進化を求め、仲間とともに高まり合い、世界に影響を与えていく。</p>
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">
                    <span className="text-ate9-red">9</span> = 常識や限界を「喰らう」視点
                  </p>
                  <p>夢を喰らい、限界を喰らい、世界の枠組みそのものを更新していく意思。</p>
                </div>
              </div>
            </div>

            {/* Core Values をタグ風に */}
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                Core Values
              </p>
              <div className="flex flex-wrap gap-2">
                {coreValues.map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center rounded-full border border-ate9-gray/50 bg-transparent px-3 py-1 text-[11px] md:text-xs text-white/70"
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