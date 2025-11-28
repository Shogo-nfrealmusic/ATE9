import { AdminShell } from '@/components/admin/lp/AdminShell';
import { getLandingContent } from '@/services/cms/landing';
import type { JSX } from 'react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage(): Promise<JSX.Element> {
  const content = await getLandingContent();

  return <AdminShell initialContent={content} />;
}
