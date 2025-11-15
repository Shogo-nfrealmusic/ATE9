"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
}

const services: ServiceItem[] = [
  {
    id: "creative-production",
    title: "Creative Production & Visual Design",
    description:
      "We are a full-service creative agency specializing in visual content, motion graphics, and interactive experiences for the digital age. Elevate your brand with our innovative solutions.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxr-8iBAHDhLLfZuVWOXQvRI3RkD5YQeqsi6_ZKE076VGl29r-QyfJOMoZyvPvoAfuhzxU-3Ti0Qf_wnPSvffSU09iBmwZFuLIMpSMtOxrDMWkRj4qMZjFb5Sa3gKRrzOq3_n3GIhZUmVRul5ypCQBYpBnepXJrWB3ew9KHurAYKllqc949T8fluPQHVN3mCjIxTcRXp17kOweHwSMAh5VP2sQABUvv1k1W6CGo1fd-DJE7_YnST7Cq6i35N5UR3EkIc9SQfmSVNo",
    backgroundColor: "#F2426D",
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy & Identity",
    description:
      "We help businesses build strong, memorable brands that resonate with their target audience. From logo design to comprehensive brand guidelines, we create cohesive visual identities.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcIgelrIJrVYREYU3mJWRQoN0k5l6xI69V-zUbhU7galVQISVb2SDTvYU8nddUD72cbh5f_i-dRfy91G86bKDr7y9dVprvu0bQ2CPvwLceE5A2fyqwwW6beLkV-oFzGbQ8J_tjR20nuiTnzIgVwXwNsOX4ZCm3C4P8JdrGYk4bt2b6k6MEkuypriTg9p5OIkrrhvEfoPNg29xOwm5lj0Xzma9TNQ4DUv4dh3Rblkkbqw9ehIWFi4FK_rbF0FAdOzwPF49VRTxirBw",
    backgroundColor: "#E4EEFA",
  },
  {
    id: "digital-experience",
    title: "Digital Experience Design",
    description:
      "Creating intuitive and engaging digital experiences that users love. We combine user research, design thinking, and cutting-edge technology to deliver exceptional results.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFjoonk0jREp72pVriB1yhJ-iqPtPIXBEacYNDL_F53CHi3SCRhkpnvmVvJFxD13MNSqclmjWf5k7VYwFsGgksYFdWeys0iAmmYK2tMg9C_TSW-8LQIsajWn6HkLFOMpMEjQj1eWsJQxUONNoZNuCNKKK4hyviEZYd_nVNJKmXM29vbiL9AniUEyCbVeZthACstlgfT6vC9rWT2ZWLScl_hhqXHGGjT4ERw9MU5ISu43cQL4JA-tASQPDjNNHGXXKgwt3ovzGj94g",
    backgroundColor: "#F0F5FF",
  },
];

export function SectionServices() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // スクロールに連動してインデックスを更新（自動再生時は無効化）
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isAutoPlaying) {
      const newIndex = Math.min(
        Math.floor(latest * services.length),
        services.length - 1
      );
      setCurrentIndex(newIndex);
    }
  });

  // 自動切り替え
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4000); // 4秒ごとに切り替え

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // 各アイテムの位置とスケールを計算
  const getItemTransform = (index: number) => {
    const diff = index - currentIndex;
    const isCurrent = diff === 0;

    if (isCurrent) {
      return {
        x: 0,
        scale: 1.0177,
        skewX: 0,
        zIndex: 1,
        opacity: 1,
      };
    }

    // 左側のアイテム（負のdiff）
    if (diff < 0) {
      const offset = Math.abs(diff) * 143.176; // パーセンテージベースのオフセット
      return {
        x: -offset,
        scale: 1,
        skewX: -19.0901,
        zIndex: 2,
        opacity: 0.3,
      };
    }

    // 右側のアイテム（正のdiff）
    const offset = diff * 143.176;
    return {
      x: offset,
      scale: 1,
      skewX: 19.0901,
      zIndex: 2,
      opacity: 0.3,
    };
  };

  const currentService = services[currentIndex];

  return (
    <section
      ref={containerRef}
      className="bg-section-pastel dark:bg-gray-900/50"
      id="services"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Card className="overflow-hidden bg-white">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* 左側: テキストコンテンツ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6 p-8 lg:p-12"
            >
              <div className="flex flex-col gap-4">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20 w-fit">
                  SERVICES
                </span>
                <div className="flex items-center gap-3">
                  <div className="text-primary size-8 shrink-0">
                    <svg
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-text-headings">
                    ATE9
                  </h2>
                </div>
              </div>

              {/* テキストコンテンツ（フェードイン/アウト） */}
              <div className="relative min-h-[200px]">
                {services.map((service, index) => {
                  const isCurrent = index === currentIndex;
                  return (
                    <motion.div
                      key={service.id}
                      initial={false}
                      animate={{
                        opacity: isCurrent ? 1 : 0,
                        visibility: isCurrent ? "visible" : "hidden",
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <h3 className="text-3xl font-bold leading-tight tracking-tighter text-text-headings md:text-4xl">
                        {service.title}
                      </h3>
                      <p className="mt-4 text-lg text-text-body">
                        {service.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <Button size="lg" className="w-full sm:w-auto">
                <span className="material-symbols-outlined rounded-full bg-white/20 p-1 text-xl">
                  arrow_forward
                </span>
                <span className="truncate">Explore Services</span>
              </Button>
            </motion.div>

            {/* 右側: スライダー */}
            <div className="relative flex h-full min-h-[400px] items-center justify-center overflow-hidden p-8 lg:min-h-[500px]">
              <div className="relative h-[450px] w-full max-w-[500px]">
                {services.map((service, index) => {
                  const transform = getItemTransform(index);
                  return (
                    <motion.div
                      key={service.id}
                      className="absolute inset-0"
                      style={{
                        zIndex: transform.zIndex,
                      }}
                      animate={{
                        x: `${transform.x}%`,
                        scale: transform.scale,
                        skewX: `${transform.skewX}deg`,
                        opacity: transform.opacity,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <motion.div
                        className="h-full w-full"
                        style={{
                          backgroundColor: service.backgroundColor,
                          transform: `translate3d(${transform.x > 0 ? transform.x : 0}%, 0, 0) skew(${-transform.skewX}deg, 0deg)`,
                        }}
                        animate={{
                          x: transform.x > 0 ? `${transform.x}%` : "0%",
                        }}
                        transition={{
                          duration: 0.6,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                          <div className="flex h-full flex-col p-3">
                            <div className="flex items-center justify-between">
                              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
                                menu
                              </span>
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                ATE9 productions.
                              </span>
                              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">
                                menu
                              </span>
                            </div>
                            <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
                              {[
                                service.imageUrl,
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuDcIgelrIJrVYREYU3mJWRQoN0k5l6xI69V-zUbhU7galVQISVb2SDTvYU8nddUD72cbh5f_i-dRfy91G86bKDr7y9dVprvu0bQ2CPvwLceE5A2fyqwwW6beLkV-oFzGbQ8J_tjR20nuiTnzIgVwXwNsOX4ZCm3C4P8JdrGYk4bt2b6k6MEkuypriTg9p5OIkrrhvEfoPNg29xOwm5lj0Xzma9TNQ4DUv4dh3Rblkkbqw9ehIWFi4FK_rbF0FAdOzwPF49VRTxirBw",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBFjoonk0jREp72pVriB1yhJ-iqPtPIXBEacYNDL_F53CHi3SCRhkpnvmVvJFxD13MNSqclmjWf5k7VYwFsGgksYFdWeys0iAmmYK2tMg9C_TSW-8LQIsajWn6HkLFOMpMEjQj1eWsJQxUONNoZNuCNKKK4hyviEZYd_nVNJKmXM29vbiL9AniUEyCbVeZthACstlgfT6vC9rWT2ZWLScl_hhqXHGGjT4ERw9MU5ISu43cQL4JA-tASQPDjNNHGXXKgwt3ovzGj94g",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBWKKb5kw2yetwFRWdhetRLJ-7VIJCe3l-vw-yJrMbpzPeAFKr3Ik_eZ1taKrWGuUHAz_p5GoWOM_Na_x8E3VcuQZ9qrqM6JWjknPpPvRP96Zve4ORuERmWiQ-rDuQ7lYP5dxk_iMTR31UHt4ykyk4OUhxPIJdR-2judYI-VcTwZZs1zFMzqfxgubJhsfkkuWLGJBuKPia_MeZx-qvklRYLU5X4gmTC9gnpB-4J-8YvoT4qjHx4PY3O9Ga4AWUmdAMTUinpBLU08B0",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCO8_KIs8EFWw_n33CJy5lU0M_oFB0FkPt6FXXuhPBck2xZiN3I2hCCmxZfwRNrKyv8jaOOjvMYVDsa7u-qwHgQP7X_HeJ87HjjB_hG31QTcAPnkRCZr41cMJy1rCXX4JpL4HMqyDISIgDydxXX-Ng27tfqV0X0Aapi491LkbUu7Qp__Lt5J4O5VpU1xpg5Gqrk-mhfJ73dwEWYjuoMvncz1hCA-Q87tTi2SEbJ4fOeDygB5agTD3YBhsQrqqwRZPHonWs2ZqTxSRA",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCE8Ve0YVmiswa622qUip7Ng2zUDhAq6Hiq9hpH8bD6dObkVMRRUDH0UAz7gCJhnqjyL6hZD1ao8wUizxfrzn1VJkgD5i7vFSRGz9_26k7VJ5EG9NGip_oCaoZmLY_YijJUwTnwXC872KO7opPfn0UvEQ7qJ-k7cjpeSIA1OmwMYvsOinsljUhwO5O1cQn5t49CX5f7RaHWCTlqIWGWFCpjUNZ2B3hnG_vWm7hhaHFJ4pPbEticjiiXBrK8h9WB3k6UkdACf4_cT64",
                              ].map((src, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-lg bg-white/80 backdrop-blur-sm"
                                >
                                  <Image
                                    alt={`gallery item ${idx + 1}`}
                                    className="h-full w-full rounded-lg object-cover"
                                    src={src}
                                    width={100}
                                    height={100}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="material-symbols-outlined text-gray-400">
                                circle
                              </span>
                              <span className="material-symbols-outlined text-gray-400">
                                square
                              </span>
                              <span className="material-symbols-outlined text-primary">
                                open_in_new
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* インジケーター */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false); // 手動操作時は自動再生を停止
                      // 5秒後に自動再生を再開
                      setTimeout(() => setIsAutoPlaying(true), 5000);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-gray-300"
                    }`}
                    aria-label={`Go to service ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
