const STORAGE_OBJECT_PATH = '/storage/v1/object/';
const STORAGE_RENDER_PATH = '/storage/v1/render/image/';

export const IMAGE_FALLBACK_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

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

function getSupabaseBaseUrl(): URL | null {
  return safeParseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function normalizeSrc(src?: string | null): string | null {
  if (typeof src !== 'string') {
    return null;
  }
  const trimmed = src.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isAbsoluteUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function isSupabaseRelativePath(src: string): boolean {
  const normalized = src.startsWith('/') ? src.slice(1) : src;
  return normalized.startsWith('storage/');
}

function toRenderEndpoint(url: URL): URL {
  const next = new URL(url.toString());

  if (next.pathname.startsWith(STORAGE_RENDER_PATH)) {
    return next;
  }

  if (next.pathname.startsWith(STORAGE_OBJECT_PATH)) {
    const objectPath = next.pathname.slice(STORAGE_OBJECT_PATH.length);
    next.pathname = `${STORAGE_RENDER_PATH}${objectPath}`;
  }

  return next;
}

export function buildRenderImageUrl(
  src?: string | null,
  options?: { width?: number; quality?: number },
): string | null {
  const normalized = normalizeSrc(src);
  if (!normalized) {
    return null;
  }

  let url: URL | null = null;

  if (isAbsoluteUrl(normalized)) {
    try {
      url = new URL(normalized);
    } catch {
      return normalized;
    }
  } else if (isSupabaseRelativePath(normalized)) {
    const baseUrl = getSupabaseBaseUrl();
    if (!baseUrl) {
      return normalized;
    }
    try {
      url = new URL(normalized.startsWith('/') ? normalized : `/${normalized}`, baseUrl);
    } catch {
      return normalized;
    }
  } else {
    return normalized;
  }

  if (!url) {
    return normalized;
  }

  const supabaseBaseUrl = getSupabaseBaseUrl();
  if (supabaseBaseUrl && url.origin === supabaseBaseUrl.origin) {
    url = toRenderEndpoint(url);
  }

  if (options?.width) {
    url.searchParams.set('width', String(options.width));
  }
  if (options?.quality) {
    url.searchParams.set('quality', String(options.quality));
  }

  return url.toString();
}

export function buildRenderSrcSet(
  src: string | null | undefined,
  widths: number[],
  options?: { quality?: number },
): string | undefined {
  const normalized = normalizeSrc(src);
  if (!normalized || widths.length === 0) {
    return undefined;
  }

  const parts: string[] = [];
  for (const width of widths) {
    const url = buildRenderImageUrl(normalized, { width, quality: options?.quality });
    if (url) {
      parts.push(`${url} ${width}w`);
    }
  }

  return parts.length > 0 ? parts.join(', ') : undefined;
}
