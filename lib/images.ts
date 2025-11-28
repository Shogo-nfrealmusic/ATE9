const SUPABASE_BASE_URL = safeParseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

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

export function buildRenderImageUrl(src?: string | null): string | null {
  const normalized = normalizeSrc(src);
  if (!normalized) {
    return null;
  }

  if (isAbsoluteUrl(normalized)) {
    return normalized;
  }

  if (isSupabaseRelativePath(normalized)) {
    if (!SUPABASE_BASE_URL) {
      console.warn('[buildRenderImageUrl] NEXT_PUBLIC_SUPABASE_URL is not set');
      return null;
    }
    try {
      const url = new URL(
        normalized.startsWith('/') ? normalized : `/${normalized}`,
        SUPABASE_BASE_URL,
      );
      return url.toString();
    } catch (error) {
      console.error('[buildRenderImageUrl] failed to build absolute Supabase URL', {
        src: normalized,
        error,
      });
      return null;
    }
  }

  return normalized;
}

export function buildRenderSrcSet(): string | undefined {
  return undefined;
}
