"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  const handleSmoothScroll = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    targetId: string
  ) => {
    event.preventDefault();
    const element = document.querySelector(targetId);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap bg-transparent px-10 py-4">
      <div className="flex items-center gap-4">
        <div className="size-5 text-ate9-red">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          ATE9
        </h2>
      </div>
      <nav className="flex flex-1 items-center justify-end gap-8">
        {[
          { label: "About", href: "#about" },
          { label: "Philosophy", href: "#brand-philosophy" },
          { label: "Mission", href: "#mission" },
          { label: "Services", href: "#services" },
          { label: "Portfolio", href: "#portfolio" },
        ].map((item) => (
          <div key={item.label}>
            <Link
              href={item.href}
              onClick={(event) => handleSmoothScroll(event, item.href)}
              className="group relative text-white text-sm font-medium leading-normal transition-colors hover:text-ate9-red"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-ate9-red transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        ))}
        <div>
          <Button
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-ate9-red text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-ate9-red-dark"
            onClick={(event) => handleSmoothScroll(event, "#contact")}
          >
            <span className="truncate">Contact</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
