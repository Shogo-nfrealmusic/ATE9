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
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#" className="flex items-center gap-3">
          <div className="text-primary size-5">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tighter text-text-headings dark:text-white">
            ATE9
          </h2>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#mission"
            onClick={(event) => handleSmoothScroll(event, "#mission")}
            className="text-sm font-medium text-text-body transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
          >
            Mission
          </Link>
          <Link
            href="#services"
            onClick={(event) => handleSmoothScroll(event, "#services")}
            className="text-sm font-medium text-text-body transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
          >
            Services
          </Link>
          <Link
            href="#portfolio"
            onClick={(event) => handleSmoothScroll(event, "#portfolio")}
            className="text-sm font-medium text-text-body transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
          >
            Portfolio
          </Link>
        </nav>
        <Button
          className="min-w-[100px]"
          size="default"
          onClick={(event) => handleSmoothScroll(event, "#contact")}
        >
          Contact Us
        </Button>
      </div>
    </header>
  );
}

