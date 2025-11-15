import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "ATE9 - Elevating Experiences, One Design at a Time",
  description:
    "ATE9 crafts intuitive and impactful digital solutions that resonate with users and drive business growth.",
};

export default function LPLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-body dark:text-gray-300">
      {children}
    </div>
  );
}

