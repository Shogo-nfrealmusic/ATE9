const GOOGLE_CONTENT_HOST = 'googleusercontent.com';

const sizeMap: Record<'small' | 'medium' | 'full', number> = {
  small: 640,
  medium: 1200,
  full: 1800,
};

export const DEFAULT_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNFMEUwRTAiIC8+PC9zdmc+';

export function getOptimizedImageUrl(
  url: string,
  size: 'small' | 'medium' | 'full' = 'full',
): string {
  if (!url) {
    return '';
  }

  if (!url.includes(GOOGLE_CONTENT_HOST)) {
    return url;
  }

  const width = sizeMap[size];
  return url.includes('=')
    ? `${url}&w=${width}`
    : `${url}=w${width}-h${Math.round(width * 0.75)}-c`;
}
