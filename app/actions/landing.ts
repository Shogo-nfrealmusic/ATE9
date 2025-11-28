'use server';

import { createServerSupabaseClient } from '@/lib/supabase/client';
import { saveLandingContent, savePortfolioItemsForService } from '@/services/cms/landing';
import type { LandingContent, PortfolioItem } from '@/types/landing';
import { revalidatePath } from 'next/cache';

/**
 * ランディングページのコンテンツを保存し、キャッシュを無効化するサーバーアクション
 */
export async function saveLandingContentAction(content: LandingContent): Promise<LandingContent> {
  const supabase = createServerSupabaseClient();

  try {
    const saved = await saveLandingContent({ supabase, content });

    // LPページのキャッシュを無効化（本番環境でも反映されるように）
    revalidatePath('/', 'page');
    // admin画面のキャッシュも無効化（保存後に最新データが表示されるように）
    revalidatePath('/admin/dashboard', 'page');

    return saved;
  } catch (error) {
    console.error('[saveLandingContentAction] failed', error);
    throw error;
  }
}

type SavePortfolioItemsForServiceActionParams = {
  serviceId: string | null;
  serviceSlug?: string;
  items: PortfolioItem[];
};

export async function savePortfolioItemsForServiceAction({
  serviceId,
  serviceSlug,
  items,
}: SavePortfolioItemsForServiceActionParams): Promise<PortfolioItem[]> {
  const supabase = createServerSupabaseClient();

  try {
    const saved = await savePortfolioItemsForService({ supabase, serviceId, items });

    revalidatePath('/', 'page');
    if (serviceSlug) {
      revalidatePath(`/services/${serviceSlug}`, 'page');
    }
    revalidatePath('/admin/dashboard', 'page');

    return saved;
  } catch (error) {
    console.error('[savePortfolioItemsForServiceAction] failed', error, { serviceId, serviceSlug });
    throw error;
  }
}

type LinkPortfolioItemToServiceParams = {
  portfolioItemId: string;
  targetServiceId: string;
  targetServiceSlug?: string;
};

export async function linkPortfolioItemToServiceAction({
  portfolioItemId,
  targetServiceId,
  targetServiceSlug,
}: LinkPortfolioItemToServiceParams): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { data: sortData, error: sortError } = await supabase
    .from('lp_portfolio_items')
    .select('sort_order')
    .eq('service_id', targetServiceId)
    .order('sort_order', { ascending: false })
    .limit(1);

  if (sortError) {
    console.error('[linkPortfolioItemToServiceAction] failed to load sort order', sortError, {
      targetServiceId,
    });
    throw new Error(sortError.message);
  }

  const nextSortOrder = ((sortData?.[0]?.sort_order as number | undefined) ?? -1) + 1;

  const { error } = await supabase
    .from('lp_portfolio_items')
    .update({
      service_id: targetServiceId,
      sort_order: nextSortOrder,
    })
    .eq('id', portfolioItemId);

  if (error) {
    console.error('[linkPortfolioItemToServiceAction] update failed', error, {
      portfolioItemId,
      targetServiceId,
    });
    throw new Error(error.message);
  }

  revalidatePath('/', 'page');
  if (targetServiceSlug) {
    revalidatePath(`/services/${targetServiceSlug}`, 'page');
  }
  revalidatePath('/admin/dashboard', 'page');
}
