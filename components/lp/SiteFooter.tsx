import Link from 'next/link';
import type { JSX } from 'react';

export function SiteFooter(): JSX.Element {
  return (
    <footer className="mt-16 border-t border-ate9-gray bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-10 py-8 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-sm font-medium text-white/80">We are not a company. We are a family.</p>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex items-center gap-5">
            <Link
              href="#"
              className="text-white/70 transition-colors hover:text-ate9-red"
              aria-label="Link to Facebook profile"
            >
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link
              href="#"
              className="text-white/70 transition-colors hover:text-ate9-red"
              aria-label="Link to Twitter profile"
            >
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </Link>
            <Link
              href="#"
              className="text-white/70 transition-colors hover:text-ate9-red"
              aria-label="Link to Instagram profile"
            >
              <svg
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </Link>
          </div>
          <p className="text-xs text-white/50">© 2025 ATE9. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
