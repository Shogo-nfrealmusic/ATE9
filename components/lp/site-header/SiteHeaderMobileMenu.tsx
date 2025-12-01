'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';

export type SiteHeaderNavItem = {
  label: string;
  href: string;
};

type SiteHeaderMobileMenuProps = {
  navItems: SiteHeaderNavItem[];
};

export function SiteHeaderMobileMenu({ navItems }: SiteHeaderMobileMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // メニュー外クリックで閉じる + body の overflow 制御
  useEffect(() => {
    if (isOpen) {
      // body のスクロールを無効化
      document.body.style.overflow = 'hidden';

      // メニュー外クリックで閉じる
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          menuRef.current &&
          buttonRef.current &&
          !menuRef.current.contains(target) &&
          !buttonRef.current.contains(target)
        ) {
          setIsOpen(false);
        }
      };

      // ESC キーで閉じる
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="relative z-[60] inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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

      {/* オーバーレイ（メニュー外の暗い背景） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm cursor-pointer"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* メニュー本体 */}
      <div
        ref={menuRef}
        className={cn(
          'fixed left-0 right-0 top-[73px] z-[60] origin-top bg-black/85 px-6 py-6 text-white backdrop-blur-lg transition-all duration-200 md:hidden',
          isOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleClose}
              className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={handleClose}
            className="text-base font-semibold tracking-wide transition-colors hover:text-ate9-red focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
