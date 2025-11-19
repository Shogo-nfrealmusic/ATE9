"use client";

import { drawLine, fadeInUp, motionTransition, viewportOnce } from "@/lib/motion/variants";
import type { AboutContent } from "@/types/landing";
import { motion } from "framer-motion";

type SectionAboutProps = {
  content: AboutContent;
};

export function SectionAbout({ content }: SectionAboutProps) {
  return (
    <section className="py-24 px-10" id="about">
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
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
        <motion.div className="flex flex-col gap-4" variants={fadeInUp}>
          <h2 className="text-white text-4xl font-bold leading-tight tracking-[-0.015em]">
            {content.heading}
          </h2>
          <motion.div
            className="w-16 h-0.5 bg-ate9-red my-2"
            variants={drawLine}
          />
          <p className="text-white/80 text-base font-normal leading-relaxed">
            {content.description}
          </p>
        </motion.div>
        <motion.div
          className="flex justify-center items-center"
          variants={fadeInUp}
        >
          <div className="relative w-64 h-64">
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
