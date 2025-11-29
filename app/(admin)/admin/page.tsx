import { requireAdminAuth } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import type { JSX } from 'react';

export default async function AdminIndexPage(): Promise<JSX.Element> {
  // 認証チェック: 未認証の場合は /admin/login にリダイレクト
  await requireAdminAuth();
  redirect('/admin/dashboard');
}
