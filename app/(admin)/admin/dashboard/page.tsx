import { AdminShell } from '@/components/admin/lp/AdminShell';
import { getLandingContent } from '@/services/cms/landing';
import type { JSX } from 'react';

export const revalidate = 60;

export default async function AdminDashboardPage(): Promise<JSX.Element> {
  const content = await getLandingContent();

  return <AdminShell initialContent={content} />;
}
