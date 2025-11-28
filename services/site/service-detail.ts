import { createServerSupabaseClient } from '@/lib/supabase/client';
import type { PortfolioItem, ServiceItem } from '@/types/landing';
import type { PostgrestError } from '@supabase/supabase-js';

export type ServiceDetail = ServiceItem & {
  /**
   * 長めの説明文。既存 description を fallback とする。
   */
  longDescription?: string | null;
};

export type ServicePortfolioItem = PortfolioItem;

type ServiceDetailRow = {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  background_color: string | null;
  gallery: string[] | null;
};

type PortfolioRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string | null;
  service_id: string | null;
  sort_order: number;
};

function isNetworkError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  const message =
    typeof error === 'string'
      ? error
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message ?? '')
        : '';

  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes('fetch failed') ||
    normalized.includes('failed to fetch') ||
    normalized.includes('econnreset') ||
    normalized.includes('network')
  );
}

function wrapNetworkError(error: PostgrestError | Error, slug: string): Error {
  let base: Error;
  if (error instanceof Error) {
    base = error;
  } else {
    const message = (error as PostgrestError).message ?? 'Unknown error';
    base = new Error(String(message));
  }
  return new Error(`Failed to load service detail for slug "${slug}"`, { cause: base });
}

export async function getServiceDetailBySlug(slug: string): Promise<ServiceDetail | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('lp_service_items')
    .select('id, slug, title, description, background_color, gallery')
    .eq('slug', slug)
    .maybeSingle<ServiceDetailRow>();

  if (error) {
    console.error('[getServiceDetailBySlug] failed', { slug, error });

    if (isNetworkError(error)) {
      throw wrapNetworkError(error, slug);
    }

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug ?? slug,
    title: data.title,
    description: data.description,
    backgroundColor: data.background_color ?? '#090909',
    gallery: data.gallery ?? [],
    longDescription: undefined,
  };
}

export async function getPortfoliosByServiceId(serviceId: string): Promise<ServicePortfolioItem[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('lp_portfolio_items')
    .select('id, title, description, image_url, link_url, service_id, sort_order')
    .eq('service_id', serviceId)
    .order('sort_order', { ascending: true })
    .returns<PortfolioRow[]>();

  if (error) {
    console.error('[getPortfoliosByServiceId] failed', { serviceId, error });
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map(
    (item): ServicePortfolioItem => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      linkUrl: item.link_url ?? undefined,
      serviceId: item.service_id ?? null,
    }),
  );
}
