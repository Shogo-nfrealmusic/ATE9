"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SectionMission() {
  return (
    <section
      id="mission"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-4 text-center lg:text-left"
          >
            <h2 className="text-3xl font-bold leading-tight tracking-tighter text-text-headings dark:text-white md:text-4xl">
              Our Mission
            </h2>
            <p className="text-lg text-text-body dark:text-gray-300">
              To solve complex problems through elegant design and cutting-edge
              technology, creating user-centric products that make a difference
              in the digital world.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col gap-2 rounded-xl bg-[#999] p-6"
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: "32px" }}
                >
                  visibility
                </span>
                <h3 className="text-lg font-bold text-gray-300">
                  Our Vision
                </h3>
                <p className="text-gray-300">
                  We envision a digital world where technology is accessible and
                  delightful for everyone.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col gap-2 rounded-xl bg-[#999] p-6"
              >
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: "32px" }}
                >
                  hub
                </span>
                <h3 className="text-lg font-bold text-gray-300">
                  Our Approach
                </h3>
                <p className="text-gray-300">
                  We combine deep user research with agile development to build
                  solutions that are beautiful and functional.
                </p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="aspect-square w-full max-w-md rounded-xl bg-gray-200 dark:bg-gray-800">
              <Image
                alt="Abstract or team-focused image"
                className="h-full w-full rounded-xl object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFbMs34fNU5712Sb6Ungiz9U-2qc7-M87TsV1jGmHb4-5EW3oA-sjr-RYV48NZeMzT8SKr62VOY-ALEhkOAfHI-JIlSe7g7ndXlQEDFrZ3voIjm9v-N3QqtzL5EtCHMyQMPgibHQq2Kyze9RhqIeQr3it4IApXOOxvfwIigDKVknHrrUHWn_YeXw6Y_NtI1yYM77CHS7Azxs83NE8S3M9QSrLG-Na0TEhmd2-A1Mzy7B-QQPOx5vcNJXiodBQOjM_cQ7x1r2IuXBU"
                width={400}
                height={400}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

