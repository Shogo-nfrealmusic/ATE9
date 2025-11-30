'use server';

import { createServerSupabaseClient } from '@/lib/supabase/client';
import {
  saveAboutSectionToDb,
  saveBrandPhilosophySectionToDb,
  saveHeroToDb,
  savePortfolioItemsForService,
  savePortfolioMetadataToDb,
  saveServicesToDb,
} from '@/services/cms/landing';
import type {
  AboutContent,
  BrandPhilosophyContent,
  HeroContent,
  PortfolioContent,
  PortfolioItem,
  ServicesContent,
} from '@/types/landing';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

async function fetchServiceSlugs(supabase: SupabaseClient): Promise<string[]> {
  const { data, error } = await supabase
    .from('lp_service_items')
    .select('slug')
    .order('slug', { ascending: true });

  if (error) {
    console.error('[fetchServiceSlugs] failed', error);
    throw new Error(`service-slugs: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => row.slug ?? null)
    .filter((slug): slug is string => Boolean(slug));
}

function revalidateCommonPaths(): void {
  revalidatePath('/', 'page');
  revalidatePath('/admin/dashboard', 'page');
}

export async function saveHeroSectionAction(hero: HeroContent): Promise<void> {
  const supabase = createServerSupabaseClient();
  try {
    await saveHeroToDb(supabase, hero);
    revalidateCommonPaths();
  } catch (error) {
    console.error('[saveHeroSectionAction] failed', error);
    throw error;
  }
}

export async function saveAboutSectionAction(about: AboutContent): Promise<void> {
  const supabase = createServerSupabaseClient();
  try {
    await saveAboutSectionToDb(supabase, about);
    revalidateCommonPaths();
  } catch (error) {
    console.error('[saveAboutSectionAction] failed', error);
    throw error;
  }
}

export async function saveBrandPhilosophySectionAction(
  brandPhilosophy: BrandPhilosophyContent,
): Promise<void> {
  const supabase = createServerSupabaseClient();
  try {
    await saveBrandPhilosophySectionToDb(supabase, brandPhilosophy);
    revalidateCommonPaths();
  } catch (error) {
    console.error('[saveBrandPhilosophySectionAction] failed', error);
    throw error;
  }
}

export async function saveServicesSectionAction(services: ServicesContent): Promise<void> {
  const supabase = createServerSupabaseClient();
  try {
    const beforeSlugs = await fetchServiceSlugs(supabase);
    await saveServicesToDb(supabase, services);
    const afterSlugs = await fetchServiceSlugs(supabase);
    const slugsToRevalidate = new Set([...beforeSlugs, ...afterSlugs]);

    slugsToRevalidate.forEach((slug) => revalidatePath(`/services/${slug}`, 'page'));
    revalidateCommonPaths();
  } catch (error) {
    console.error('[saveServicesSectionAction] failed', error);
    throw error;
  }
}

export async function savePortfolioMetadataAction(
  portfolio: Pick<PortfolioContent, 'heading' | 'subheading'>,
): Promise<void> {
  const supabase = createServerSupabaseClient();
  try {
    await savePortfolioMetadataToDb(supabase, portfolio);
    revalidateCommonPaths();
  } catch (error) {
    console.error('[savePortfolioMetadataAction] failed', error);
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
