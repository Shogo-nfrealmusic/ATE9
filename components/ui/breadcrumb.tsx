import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { JSX, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  separatorIcon?: ReactNode;
};

export function Breadcrumb({ items, className, separatorIcon }: BreadcrumbProps): JSX.Element {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex w-full flex-wrap items-center gap-1 bg-transparent text-xs leading-relaxed text-muted-foreground md:text-sm',
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.isCurrent ?? isLast;
          const showSeparator = !isLast;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {item.href && !isCurrent ? (
                <Link
                  className="text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'font-medium text-foreground',
                    !isCurrent && 'text-muted-foreground/80',
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {showSeparator ? (
                <span
                  aria-hidden="true"
                  className="mx-1.5 inline-flex items-center text-muted-foreground/60 md:mx-2"
                >
                  {separatorIcon ?? (
                    <ChevronRightIcon className="size-3 text-current md:size-3.5" />
                  )}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
