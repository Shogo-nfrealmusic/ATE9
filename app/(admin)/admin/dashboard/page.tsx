import { AdminShell } from '@/components/admin/lp/AdminShell';
import { requireAdminAuth } from '@/lib/admin/auth';
import { getLandingContent } from '@/services/cms/landing';
import type { JSX } from 'react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage(): Promise<JSX.Element> {
  // 認証チェック: 未認証の場合は /admin/login にリダイレクト
  await requireAdminAuth();

  const content = await getLandingContent();

  return <AdminShell initialContent={content} />;
}
