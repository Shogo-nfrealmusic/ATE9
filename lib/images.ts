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

/**
 * 画像 URL をそのまま返す（変換なし）
 * Supabase の render API は使わず、元の URL をそのまま使用
 */
export function buildRenderImageUrl(
  src?: string | null,
  _options?: { width?: number; quality?: number },
): string | null {
  const normalized = normalizeSrc(src);
  if (!normalized) {
    return null;
  }

  // 絶対 URL の場合はそのまま返す
  if (isAbsoluteUrl(normalized)) {
    return normalized;
  }

  // Supabase 相対パスの場合は絶対 URL に変換
  if (isSupabaseRelativePath(normalized)) {
    const baseUrl = safeParseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (!baseUrl) {
      // build 時に env が undefined の場合は null を返す
      // 呼び出し側で元の URL にフォールバックする
      return null;
    }
    try {
      const url = new URL(normalized.startsWith('/') ? normalized : `/${normalized}`, baseUrl);
      return url.toString();
    } catch {
      return null;
    }
  }

  // その他の相対パス（/images/... など）はそのまま返す
  return normalized;
}

/**
 * srcSet は使わない（画像をそのまま配信するため）
 */
export function buildRenderSrcSet(
  _src: string | null | undefined,
  _widths: number[],
  _options?: { quality?: number },
): string | undefined {
  return undefined;
}
