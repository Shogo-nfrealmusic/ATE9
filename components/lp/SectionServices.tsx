'use client';

import {
  fadeInUp,
  hoverScale,
  motionTransition,
  staggerContainer,
  viewportOnce,
} from '@/lib/motion/variants';
import type { ServicesContent } from '@/types/landing';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

type SectionServicesProps = {
  content: ServicesContent;
};

export function SectionServices({ content }: SectionServicesProps): JSX.Element {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="services">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] text-white sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={motionTransition.default}
        >
          Our Services
        </motion.h2>
        {content.intro && (
          <motion.p
            className="mx-auto mt-4 mb-10 max-w-3xl text-center text-sm text-white/70 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={motionTransition.default}
          >
            {content.intro}
          </motion.p>
        )}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {content.items.map((item) => (
            <motion.div
              key={item.id}
              className="group relative h-full overflow-hidden rounded-xl bg-ate9-gray"
              variants={fadeInUp}
              whileHover={hoverScale}
            >
              <motion.div
                className="relative flex h-full flex-col gap-4 p-6 sm:p-8"
                transition={motionTransition.fast}
                whileHover={{ y: -4 }}
              >
                {/* ベースのダークグラデーション */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                {/* ホバー時にブランドレッドがふわっと乗るレイヤー */}
                <div className="pointer-events-none absolute inset-0 opacity-0 bg-linear-to-br from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col gap-4">
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-ate9-red-light">
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

                  <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
                    {item.description}
                  </p>
                </div>

                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent"
                  whileHover={{ borderColor: 'rgb(242, 66, 109)' }}
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
