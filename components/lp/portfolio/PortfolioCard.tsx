import { DEFAULT_BLUR_DATA_URL, getOptimizedImageUrl } from '@/lib/images';
import Image from 'next/image';
import type { JSX } from 'react';
import type { PortfolioItemForUI } from './types';

type PortfolioCardProps = {
  item: PortfolioItemForUI;
};

export function PortfolioCard({ item }: PortfolioCardProps): JSX.Element {
  const optimizedSrc = getOptimizedImageUrl(item.imageUrl, 'small') || item.imageUrl;
  const card = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-ate9-gray transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(242,66,109,0.18)]">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={optimizedSrc}
          alt={item.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR_DATA_URL}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 opacity-0 bg-linear-to-t from-ate9-red/40 via-transparent to-transparent mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-ate9-red-light sm:text-2xl">
          {item.title}
        </h3>
        {item.description ? (
          <p className="text-sm text-white/80 sm:text-base">{item.description}</p>
        ) : null}
        {item.linkUrl ? (
          <span className="mt-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            <span className="relative inline-block">
              <span className="relative z-10">View Project</span>
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-50 bg-white/30 transition duration-300 group-hover:scale-x-100 group-hover:bg-ate9-red" />
            </span>
          </span>
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition group-hover:border-ate9-red/60" />
    </div>
  );

  if (!item.linkUrl) {
    return <div className="h-full">{card}</div>;
  }

  const isExternal = /^https?:\/\//.test(item.linkUrl);
  return (
    <a
      href={item.linkUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ate9-red focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {card}
    </a>
  );
}
