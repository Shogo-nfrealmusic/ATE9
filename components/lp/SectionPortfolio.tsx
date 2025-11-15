"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    title: "Fintech Platform",
    description:
      "A comprehensive UI/UX redesign for a leading financial services provider.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQQzM5R243n-aMSc-RmkjKvsF2m_DhSg7q82ekuKRJSy5Dou9eUcyRhQXwHFyRmDtV0WJvtopMpBV41j5CvoaOFVf-qdU6z3clYAa5hsEAZx5rEAilLN2DWdra3PzHFGykTUueS0dnvLpTVKg94MPRbb7pRLk57u35mmLZAtOtF5_xZNrfeqDtV8am8Lt0-MJdoy9jv3o9ezRFwsqpSRXuahQXsY5krHBfQsm67HprJ1WiZAQO-i0GLvaaaCrusVset95Md4qx9aw",
    imageAlt: "A financial tech dashboard UI on a laptop screen",
  },
  {
    title: "E-commerce App",
    description:
      "Developed a high-conversion mobile shopping experience from the ground up.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-TYs9oD4RQ3n-jAcoiJxNaKs6wtAnvoIN9f4L5B-W2tFjqEe73lOyhotHKjc7xxlhcuevgWLP5urL0dJZbaxlRQ9VaUmbuvjztMFgO66AP2Mx49vTa5Mqn9ghUxi73KQZM9SAN_F1wEz6zD5737IylAR2CPCtX9_unGGp74WdT9TjdfEd5atDrVu1y5yXaZsYjUkd7N8VNRwxqtMGB5exXmh3rlmbXVv3lcqZhXJRZgdfvQdFskObRkcpOc533lijd84K-FCpJwE",
    imageAlt: "An e-commerce mobile app showing product listings",
  },
  {
    title: "Wellness Tracker",
    description:
      "Designed and built a mobile app for tracking fitness goals and mental well-being.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXa5ktZu8QhgmqHmDpad-6M9xivpINd8m1P7Ll04ZGMKrBOwW2n9k6IYPfPmqD37xxezRVeeyhWzuyYTkdQRKxJ5o-9sFHSsg13oeOily1p5mgeDC_OGbhBUbfN1OwAH8Rp-jTqy5stb0O9yHFKahvie9Env96k1UJt78WsZTFBNsjk8sUbIwtbJ9gOJcj87L92lKMMQpBjJodp4-iQGFyLn_TS70acEIIP9Kx2fNtyxAyxeOmZ_RszWJ0AzhoSupXKnnyzhBm5g",
    imageAlt: "A woman using a health and wellness app on her phone",
  },
  {
    title: "SaaS Dashboard",
    description:
      "An intuitive analytics dashboard for a B2B software-as-a-service company.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXeBO2MBk93DK4vLoTfhTYFvnbdBx-aZoC0kL9Sx_aYwo0wLQL5dAE1H2vb_XInCF0KmX_0NX5sxxhsumO4y6elxydzDJQoZ4YKhjFZ7UyadsP7IygOWFIeN3hxLF3XOXjz-g4gsMhIY_TYwCexdr3qT194-W9ovd4OBNbm-KIgN8VxpFEwVKkv54jOKWv7SQzWH6fK1atqBp_Nsd2iIj1NLzI5jkU0cO1vDkDlNliWXiVLjpBWarRwEjQxHbjpdcSdb6FFu0lMfg",
    imageAlt: "A modern SaaS dashboard with charts and data visualization",
  },
];

export function SectionPortfolio() {
  return (
    <section
      className="bg-background-light dark:bg-background-dark"
      id="portfolio"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <h2 className="text-3xl font-bold leading-tight tracking-tighter text-text-headings dark:text-white md:text-4xl">
            Our Portfolio
          </h2>
          <p className="max-w-2xl text-lg text-text-body dark:text-gray-300">
            A curated selection of our past work. See how we&apos;ve helped
            businesses like yours succeed.
          </p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {portfolioItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col gap-4"
            >
              <div className="overflow-hidden rounded-xl">
                <Image
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  width={600}
                  height={400}
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-text-headings dark:text-white">
                  {item.title}
                </h3>
                <p className="text-text-body dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

