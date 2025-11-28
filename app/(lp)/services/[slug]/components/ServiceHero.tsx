import { DEFAULT_BLUR_DATA_URL, getOptimizedImageUrl } from '@/lib/images';
import type { ServiceDetail } from '@/services/site/service-detail';
import Image from 'next/image';
import type { JSX } from 'react';

/**
 * ServiceHero
 * - 責務: サービス固有のヒーローエリアを描画し、タイトル・リード・概要/ギャラリーをまとめて表示する。
 * - props:
 *   - service: API から取得したサービス詳細 (`ServiceDetail`)
 */
export function ServiceHero({ service }: { service: ServiceDetail }): JSX.Element {
  const gradientStyle = {
    backgroundImage: `radial-gradient(circle at top, ${service.backgroundColor} 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.95) 100%)`,
  };

  const highlights =
    service.longDescription && service.longDescription.trim().length > 0
      ? extractHighlights(service.longDescription)
      : [];
  const gallery = service.gallery.slice(0, 4);
  const [primaryImage, ...secondaryImages] = gallery;

  return (
    <section className="relative overflow-hidden border-b border-white/10" style={gradientStyle}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
        <div className="flex-1 space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-white/60">Services</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {service.title}
          </h1>
          <p className="max-w-2xl text-base text-white/80 sm:text-lg">{service.description}</p>
          {highlights.length > 0 && (
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {highlights.map((highlight, index) => (
                <li key={`${highlight}-${index}`} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-ate9-red" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {primaryImage && (
          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-4/3 overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:col-span-1 sm:aspect-4/5">
              <Image
                src={getOptimizedImageUrl(primaryImage, 'full') || primaryImage}
                alt={`${service.title} hero`}
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 25vw"
                placeholder="blur"
                blurDataURL={DEFAULT_BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
            {secondaryImages.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative aspect-4/5 overflow-hidden rounded-xl border border-white/10 bg-black/40"
              >
                <Image
                  src={getOptimizedImageUrl(url, 'medium') || url}
                  alt={`${service.title} visual ${index + 2}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={DEFAULT_BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function extractHighlights(text: string, maxItems = 3): string[] {
  return text
    .split(/[\n。.!?]/)
    .map((fragment) => fragment.trim())
    .filter(Boolean)
    .slice(0, maxItems);
}
