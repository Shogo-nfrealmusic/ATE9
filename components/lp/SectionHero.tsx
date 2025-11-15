"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export function SectionHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6 text-center lg:text-left"
        >
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-text-headings dark:text-white md:text-6xl">
            Elevating Experiences, One Design at a Time.
          </h1>
          <p className="text-lg text-text-body dark:text-gray-300">
            ATE9 crafts intuitive and impactful digital solutions that resonate
            with users and drive business growth.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button size="lg" className="w-full sm:w-auto">
              <span className="truncate">Get Started</span>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="aspect-square w-full max-w-md rounded-xl bg-gray-100 dark:bg-gray-800">
            <Image
              alt="Dynamic visual representing the core product/service"
              className="h-full w-full rounded-xl object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9_PjLsnpXE6JG3InGgvT0zkecIjXHHbHARZ4pGLohKmgakBLOaO2bAMz7cSBCigmE_ray8NK8h1SNYygQEfyoygiBYHvXgrFEjgf4CaC6VA6sftCs9jwuCNeTT2JbhXzFKXoKTPazbIFPWkaPqaN832w75O3YDRQF1dS827PiJ_wVFbVhKeL7cDgD3LVti6eVlc36STVf2oxaJiX5B5p_XdYdJ0uTbSbzPTAnlbfmw8Rid5e4q65qsjYXci5Pzq_ZMX8V4MGDtTE"
              width={400}
              height={400}
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

