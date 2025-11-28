const SUPABASE_BASE_URL = safeParseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const STORAGE_OBJECT_PATH = '/storage/v1/object/';
const STORAGE_RENDER_PATH = '/storage/v1/render/image/';

type RenderImageOptions = {
  width?: number;
  quality?: number;
};

const DEFAULT_RENDER_OPTIONS: Required<RenderImageOptions> = {
  width: 960,
  quality: 75,
};

function safeParseUrl(value: string | undefined): URL | null {
  if (!value) {
    return null;
  }
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function normalizeSrc(src?: string | null): string | null {
  if (typeof src !== 'string') {
    return null;
  }
  const trimmed = src.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolveToAbsoluteUrl(src: string): URL | null {
  try {
    return new URL(src);
  } catch {
    if (!SUPABASE_BASE_URL) {
      return null;
    }

    const normalized = src.replace(/^\/+/, '');
    const hasStoragePrefix = normalized.startsWith('storage/v1/');
    const path = hasStoragePrefix ? normalized : `storage/v1/object/${normalized}`;

    return new URL(`${SUPABASE_BASE_URL.origin}/${path}`);
  }
}

function toRenderEndpoint(url: URL): URL | null {
  if (!SUPABASE_BASE_URL || url.origin !== SUPABASE_BASE_URL.origin) {
    return null;
  }

  if (url.pathname.startsWith(STORAGE_RENDER_PATH)) {
    const next = new URL(url.toString());
    next.search = '';
    return next;
  }

  if (!url.pathname.startsWith(STORAGE_OBJECT_PATH)) {
    return null;
  }

  const objectPath = url.pathname.slice(STORAGE_OBJECT_PATH.length);
  const next = new URL(`${url.origin}${STORAGE_RENDER_PATH}${objectPath}`);
  next.search = '';
  return next;
}

function appendSizingParams(url: URL, { width, quality }: RenderImageOptions): string {
  const next = new URL(url.toString());
  if (width) {
    next.searchParams.set('width', String(width));
  }
  if (quality) {
    next.searchParams.set('quality', String(quality));
  }
  return next.toString();
}

export function buildRenderImageUrl(src?: string | null, options: RenderImageOptions = {}): string {
  const normalized = normalizeSrc(src);
  if (!normalized) {
    return '';
  }

  try {
    const resolved = resolveToAbsoluteUrl(normalized);
    if (!resolved) {
      return normalized;
    }

    const renderUrl = toRenderEndpoint(resolved);
    if (!renderUrl) {
      return resolved.toString();
    }

    const mergedOptions = {
      ...DEFAULT_RENDER_OPTIONS,
      ...options,
    };

    return appendSizingParams(renderUrl, mergedOptions);
  } catch {
    return normalized;
  }
}

export function buildRenderSrcSet(
  src: string,
  widths: number[],
  options: Omit<RenderImageOptions, 'width'> = {},
): string | undefined {
  const normalized = normalizeSrc(src);
  if (!normalized || widths.length === 0) {
    return undefined;
  }

  const resolved = resolveToAbsoluteUrl(normalized);
  if (!resolved) {
    return undefined;
  }

  const renderUrl = toRenderEndpoint(resolved);
  if (!renderUrl) {
    return undefined;
  }

  const uniqueWidths = Array.from(new Set(widths)).sort((a, b) => a - b);
  const entries = uniqueWidths.map((width) =>
    appendSizingParams(renderUrl, {
      ...DEFAULT_RENDER_OPTIONS,
      ...options,
      width,
    }),
  );

  return entries.length > 0
    ? entries.map((url, index) => `${url} ${uniqueWidths[index]}w`).join(', ')
    : undefined;
}
