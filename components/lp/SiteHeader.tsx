'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { JSX, MouseEvent } from 'react';
import { useState } from 'react';

export function SiteHeader(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Philosophy', href: '#brand-philosophy' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
  ];

  const handleSmoothScroll = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string,
  ) => {
    event.preventDefault();
    const element = document.querySelector(targetId);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string,
  ) => {
    handleSmoothScroll(event, targetId);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap bg-transparent px-10 py-4">
      <div className="flex items-center gap-4">
        <div className="size-5 text-ate9-red">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">ATE9</h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition focus:outline-none cursor-pointer md:hidden"
          aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
          aria-expanded={isOpen}
        >
          <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
          <span className="relative block h-4 w-5">
            <span
              className={cn(
                'absolute left-0 top-0 h-0.5 w-full rounded-full bg-white transition-transform duration-200 ease-out',
                isOpen ? 'translate-y-[7px] rotate-45' : 'translate-y-0 rotate-0',
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-white transition-all duration-200 ease-out',
                isOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100',
              )}
            />
            <span
              className={cn(
                'absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-white transition-transform duration-200 ease-out',
                isOpen ? '-translate-y-[7px] -rotate-45' : 'translate-y-0 rotate-0',
              )}
            />
          </span>
        </button>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
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
              onClick={(event) => handleSmoothScroll(event, '#contact')}
            >
              <span className="truncate">Contact</span>
            </Button>
          </div>
        </nav>
      </div>
      <div
        className={cn(
          'absolute left-0 right-0 top-full origin-top bg-black/80 px-6 py-6 text-white backdrop-blur-lg transition-all duration-200 md:hidden',
          isOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={(event) => handleNavClick(event, '#contact')}
            className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
