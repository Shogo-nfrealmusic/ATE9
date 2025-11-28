/* eslint-disable @next/next/no-img-element -- Supabase render/image delivers optimized assets and Next/Image is intentionally avoided for this surface. */
import { IMAGE_FALLBACK_PIXEL, buildRenderImageUrl } from '@/lib/images';
import type { JSX } from 'react';
import type { PortfolioItemForUI } from './types';

type PortfolioCardProps = {
  item: PortfolioItemForUI;
};

export function PortfolioCard({ item }: PortfolioCardProps): JSX.Element {
  const rawImageSrc = item.imageUrl ?? '';
  const resolvedSrc = buildRenderImageUrl(rawImageSrc) ?? rawImageSrc;
  const imageSrc = resolvedSrc || IMAGE_FALLBACK_PIXEL;
  const card = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-ate9-gray transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(242,66,109,0.18)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-neutral-900">
        <img
          src={imageSrc}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          draggable={false}
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
