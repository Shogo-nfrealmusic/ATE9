import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { JSX } from 'react';
import { SiteHeaderMobileMenu, type SiteHeaderNavItem } from './site-header/SiteHeaderMobileMenu';

const NAV_ITEMS: SiteHeaderNavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Philosophy', href: '#brand-philosophy' },
  { label: 'Services', href: '#services' },
];

export function SiteHeader(): JSX.Element {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between whitespace-nowrap bg-transparent px-6 py-4 sm:px-10">
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 text-ate9-red">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
        </div>
        <p className="text-xl font-bold tracking-[-0.015em] text-white">ATE9</p>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-6 text-sm font-medium text-white md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative transition-colors hover:text-ate9-red"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-ate9-red transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Button
            asChild
            className="h-9 min-w-[84px] rounded-md bg-ate9-red px-4 text-sm text-white hover:bg-ate9-red-dark"
          >
            <Link href="#contact" className="flex w-full items-center justify-center">
              Contact
            </Link>
          </Button>
        </nav>

        <SiteHeaderMobileMenu navItems={NAV_ITEMS} />
      </div>
    </header>
  );
}
