'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { JSX } from 'react';
import { useState } from 'react';

export type SiteHeaderNavItem = {
  label: string;
  href: string;
};

type SiteHeaderMobileMenuProps = {
  navItems: SiteHeaderNavItem[];
};

export function SiteHeaderMobileMenu({ navItems }: SiteHeaderMobileMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition focus:outline-none"
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

      <div
        className={cn(
          'absolute left-0 right-0 top-full origin-top bg-black/85 px-6 py-6 text-white backdrop-blur-lg transition-all duration-200',
          isOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
