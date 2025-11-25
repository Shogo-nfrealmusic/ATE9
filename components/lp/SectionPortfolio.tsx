'use client';

import {
  fadeInUp,
  hoverScale,
  motionTransition,
  staggerContainer,
  viewportOnce,
} from '@/lib/motion/variants';
import type { PortfolioContent } from '@/types/landing';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { JSX } from 'react';

type SectionPortfolioProps = {
  content: PortfolioContent;
};

export function SectionPortfolio({ content }: SectionPortfolioProps): JSX.Element | null {
  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="portfolio">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] text-white sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={motionTransition.default}
        >
          {content.heading}
        </motion.h2>
        {content.subheading && (
          <motion.p
            className="mx-auto mt-4 mb-10 max-w-2xl text-center text-sm text-white/70 sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={motionTransition.default}
          >
            {content.subheading}
          </motion.p>
        )}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {content.items.map((item) => {
            const card = (
              <motion.div
                className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-ate9-gray"
                variants={fadeInUp}
                whileHover={hoverScale}
              >
                <motion.div
                  className="relative flex h-full flex-col"
                  transition={motionTransition.fast}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      alt={item.title}
                      className="rounded-t-xl object-cover"
                      src={item.imageUrl}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 opacity-0 bg-linear-to-t from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <motion.div
                    className="flex flex-1 flex-col gap-2 p-5 sm:p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={motionTransition.fast}
                  >
                    <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-ate9-red-light sm:text-2xl">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-white/80 sm:text-base">{item.description}</p>
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
                    whileHover={{ borderColor: 'rgb(242, 66, 109)' }}
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
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
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
