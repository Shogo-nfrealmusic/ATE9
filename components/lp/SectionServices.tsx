"use client";

import { fadeInUp, hoverScale, motionTransition, staggerContainer, viewportOnce } from "@/lib/motion/variants";
import type { ServicesContent } from "@/types/landing";
import { motion } from "framer-motion";

type SectionServicesProps = {
  content: ServicesContent;
};

export function SectionServices({ content }: SectionServicesProps) {
  return (
    <section className="py-24 px-10" id="services">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-center text-white text-4xl font-bold leading-tight tracking-[-0.015em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={motionTransition.default}
        >
          Our Services
        </motion.h2>
        {content.intro && (
          <motion.p
            className="mt-4 mb-12 text-center text-white/70 text-sm md:text-base max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={motionTransition.default}
          >
            {content.intro}
          </motion.p>
        )}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {content.items.map((item) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-xl bg-ate9-gray"
              variants={fadeInUp}
              whileHover={hoverScale}
            >
              <motion.div
                className="relative h-full p-8 flex flex-col gap-4"
                transition={motionTransition.fast}
                whileHover={{ y: -4 }}
              >
                {/* ベースのダークグラデーション */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                {/* ホバー時にブランドレッドがふわっと乗るレイヤー */}
                <div className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-br from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="text-white text-lg font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-ate9-red-light">
                    {item.title}
                  </h3>

                  {/* 下線アニメーション */}
                  <motion.div
                    className="w-8 h-px bg-ate9-red"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.2, ...motionTransition.fast }}
                  />

                  <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent"
                  whileHover={{ borderColor: "rgb(242, 66, 109)" }}
                  transition={motionTransition.fast}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
