'use client';

import { PortfolioGrid } from '@/components/lp/portfolio/PortfolioGrid';
import type { PortfolioItemForUI } from '@/components/lp/portfolio/types';
import type { PortfolioContent } from '@/types/landing';
import type { JSX } from 'react';

type SectionPortfolioProps = {
  content: PortfolioContent;
};

export function SectionPortfolio({ content }: SectionPortfolioProps): JSX.Element | null {
  if (content.items.length === 0) {
    return null;
  }

  const items: PortfolioItemForUI[] = content.items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
  }));

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24" id="portfolio">
      <div className="mx-auto max-w-6xl">
        <PortfolioGrid items={items} heading={content.heading} subtitle={content.subheading} />
      </div>
    </section>
  );
}
