'use client';

import { drawLine, fadeInUp, motionTransition, viewportOnce } from '@/lib/motion/variants';
import type { AboutContent } from '@/types/landing';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

type SectionAboutProps = {
  content: AboutContent;
};

export function SectionAbout({ content }: SectionAboutProps): JSX.Element {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="about">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div className="flex flex-col gap-4 text-center md:text-left" variants={fadeInUp}>
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl lg:text-5xl">
            {content.heading}
          </h2>
          <motion.div className="mx-auto my-2 h-0.5 w-16 bg-ate9-red md:mx-0" variants={drawLine} />
          <p className="text-sm font-normal leading-relaxed text-white/80 sm:text-base">
            {content.description}
          </p>
        </motion.div>
        <motion.div className="flex items-center justify-center" variants={fadeInUp}>
          <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64">
            <motion.div
              className="absolute inset-0 border-2 border-ate9-red-dark transform rotate-45"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.2, ...motionTransition.default }}
            />
            <motion.div
              className="absolute inset-4 border-2 border-ate9-gray transform rotate-45"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.3, ...motionTransition.default }}
            />
            <motion.div
              className="absolute inset-8 border-2 border-ate9-red transform rotate-45"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.4, ...motionTransition.default }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
