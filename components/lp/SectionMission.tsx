"use client";

import { drawLine, fadeInUp, motionTransition, viewportOnce } from "@/lib/motion/variants";
import type { MissionContent } from "@/types/landing";
import { motion } from "framer-motion";

type SectionMissionProps = {
  content: MissionContent;
};

export function SectionMission({ content }: SectionMissionProps) {
  return (
    <section className="py-24 px-10 text-center" id="mission">
      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h2
          className="text-white text-3xl font-bold leading-tight tracking-[-0.015em] md:text-4xl"
          variants={{
            hidden: {
              opacity: 0,
              letterSpacing: "-0.05em",
            },
            visible: {
              opacity: 1,
              letterSpacing: "-0.015em",
              transition: {
                ...motionTransition.default,
                letterSpacing: {
                  duration: 0.8,
                  ease: "easeOut",
                },
              },
            },
          }}
        >
          {content.heading}
        </motion.h2>
        <motion.p
          className="text-white/80 text-base font-normal leading-relaxed"
          variants={fadeInUp}
        >
          {content.description}
        </motion.p>
        <motion.div
          className="w-24 h-0.5 bg-ate9-red mt-4"
          variants={drawLine}
        />
      </motion.div>
    </section>
  );
}
