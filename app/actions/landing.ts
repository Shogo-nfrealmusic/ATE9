'use server';

import { saveLandingContent } from '@/services/cms/landing';
import type { LandingContent } from '@/types/landing';
import { revalidatePath } from 'next/cache';

/**
 * ランディングページのコンテンツを保存し、キャッシュを無効化するサーバーアクション
 */
export async function saveLandingContentAction(content: LandingContent): Promise<LandingContent> {
  const saved = await saveLandingContent(content);

  // LPページのキャッシュを無効化（本番環境でも反映されるように）
  revalidatePath('/', 'page');
  // admin画面のキャッシュも無効化（保存後に最新データが表示されるように）
  revalidatePath('/admin/dashboard', 'page');

  return saved;
}
