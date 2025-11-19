"use client";

import { fadeInUp, hoverScale, motionTransition, staggerContainer, viewportOnce } from "@/lib/motion/variants";
import type { PortfolioContent } from "@/types/landing";
import { motion } from "framer-motion";
import Image from "next/image";

type SectionPortfolioProps = {
  content: PortfolioContent;
};

export function SectionPortfolio({ content }: SectionPortfolioProps) {
  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-10" id="portfolio">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-center text-white text-4xl font-bold leading-tight tracking-[-0.015em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={motionTransition.default}
        >
          {content.heading}
        </motion.h2>
        {content.subheading && (
          <motion.p
            className="mt-4 mb-12 text-center text-white/70 text-sm md:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={motionTransition.default}
          >
            {content.subheading}
          </motion.p>
        )}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {content.items.map((item) => {
            const card = (
              <motion.div
                className="group relative overflow-hidden rounded-xl bg-ate9-gray"
                variants={fadeInUp}
                whileHover={hoverScale}
              >
              <motion.div
                className="relative w-full h-full"
                transition={motionTransition.fast}
                whileHover={{ y: -4 }}
              >
                  <Image
                    alt={item.title}
                    className="w-full h-full object-cover"
                    src={item.imageUrl}
                    width={400}
                    height={300}
                  />
                  {/* ベースのダークグラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  {/* ホバー時にブランドレッドがふわっと乗るレイヤー */}
                  <div className="absolute inset-0 opacity-0 bg-gradient-to-t from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-end p-6 gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={motionTransition.fast}
                  >
                    <h3 className="text-white text-2xl font-bold transition-colors duration-300 group-hover:text-ate9-red-light">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-white/80 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.linkUrl && (
                      <span className="mt-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                        <span className="relative inline-block">
                          <span className="relative z-10">View Project</span>
                          <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-50 bg-white/30 transition-transform duration-300 group-hover:scale-x-100 group-hover:bg-ate9-red" />
                        </span>
                      </span>
                    )}
                  </motion.div>
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent"
                    whileHover={{ borderColor: "rgb(242, 66, 109)" }}
                    transition={motionTransition.fast}
                  />
                </motion.div>
              </motion.div>
            );

            if (!item.linkUrl) {
              return (
                <div key={item.id} className="h-full">
                  {card}
                </div>
              );
            }

            const isExternal = /^https?:\/\//.test(item.linkUrl);

            return (
              <a
                key={item.id}
                href={item.linkUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {card}
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
